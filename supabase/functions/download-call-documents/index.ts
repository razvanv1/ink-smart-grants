import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Download Call Documents — Real File Ingestion
 * 
 * Flow:
 * 1. Validates auth + org membership
 * 2. Fetches the source URL (follows redirects)
 * 3. Uploads the file to Supabase Storage (call-documents bucket)
 * 4. Creates/updates call_documents record with storage_path, file_size, content_type
 * 5. Updates opportunity docs_status + lifecycle
 * 
 * Limitations:
 * - Max file size ~50MB (Deno edge function memory)
 * - Only downloads from the source_url on the opportunity
 * - Parsing (PDF text extraction) is NOT done here — left for OpenClaw
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const anonClient = createClient(supabaseUrl, anonKey);

  // Auth
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authErr } = await anonClient.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { opportunityId } = await req.json();
    if (!opportunityId) {
      return new Response(JSON.stringify({ error: "Missing opportunityId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch opportunity
    const { data: opp, error: oppErr } = await supabase
      .from("opportunities")
      .select("id, organization_id, source_url, call_name, lifecycle, docs_status")
      .eq("id", opportunityId)
      .single();

    if (oppErr || !opp) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify org membership
    const { data: membership } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", opp.organization_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not authorized for this organization" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!opp.source_url) {
      return new Response(JSON.stringify({ error: "No source URL on this opportunity" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as downloading
    await supabase
      .from("opportunities")
      .update({ docs_status: "downloading" })
      .eq("id", opportunityId);

    // Attempt to fetch the source URL
    let fileResponse: Response;
    try {
      fileResponse = await fetch(opp.source_url, {
        headers: {
          "User-Agent": "INK-FundingBot/1.0 (document-ingestion)",
          "Accept": "text/html,application/pdf,application/xml,*/*",
        },
        redirect: "follow",
      });
    } catch (fetchErr) {
      const errMsg = fetchErr instanceof Error ? fetchErr.message : "Network error";
      console.error("Fetch error:", errMsg);

      // Update doc record with error
      await upsertDocWithError(supabase, opportunityId, opp.call_name, opp.source_url, errMsg);
      await supabase
        .from("opportunities")
        .update({ docs_status: "not_downloaded" })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch source: ${errMsg}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!fileResponse.ok) {
      const errMsg = `HTTP ${fileResponse.status} from source URL`;
      await upsertDocWithError(supabase, opportunityId, opp.call_name, opp.source_url, errMsg);
      await supabase
        .from("opportunities")
        .update({ docs_status: "not_downloaded" })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ success: false, error: errMsg }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read file content
    const contentType = fileResponse.headers.get("content-type") || "application/octet-stream";
    const fileBytes = new Uint8Array(await fileResponse.arrayBuffer());
    const fileSize = fileBytes.length;

    // Determine file extension
    const ext = guessExtension(contentType, opp.source_url);
    const sanitizedName = opp.call_name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
    const storagePath = `${opp.organization_id}/${opportunityId}/${sanitizedName}${ext}`;

    // Upload to Storage
    const { error: uploadErr } = await supabase.storage
      .from("call-documents")
      .upload(storagePath, fileBytes, {
        contentType,
        upsert: true,
      });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      await upsertDocWithError(supabase, opportunityId, opp.call_name, opp.source_url, `Storage upload failed: ${uploadErr.message}`);
      await supabase
        .from("opportunities")
        .update({ docs_status: "not_downloaded" })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ success: false, error: `Storage upload failed: ${uploadErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert document record
    const nowIso = new Date().toISOString();
    const docType = contentType.includes("pdf") ? "guide" :
                    contentType.includes("html") ? "webpage" : "other";

    // Check if doc already exists for this opportunity
    const { data: existingDoc } = await supabase
      .from("call_documents")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .eq("url", opp.source_url)
      .maybeSingle();

    const docRecord = {
      opportunity_id: opportunityId,
      name: `${opp.call_name} · Source document`,
      doc_type: docType,
      url: opp.source_url,
      storage_path: storagePath,
      file_size: fileSize,
      content_type: contentType,
      downloaded_at: nowIso,
      parsed: false,
      download_error: null,
    };

    if (existingDoc) {
      await supabase.from("call_documents").update(docRecord).eq("id", existingDoc.id);
    } else {
      await supabase.from("call_documents").insert(docRecord);
    }

    // Update opportunity status
    const lifecycleUpdate: Record<string, string> = { docs_status: "docs_pending" };
    if (opp.lifecycle === "discovered" || opp.lifecycle === "saved") {
      lifecycleUpdate.lifecycle = "docs_pending";
    }
    await supabase.from("opportunities").update(lifecycleUpdate).eq("id", opportunityId);

    // Add action item if not exists
    const { data: existingAction } = await supabase
      .from("call_action_items")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .ilike("action", "%review%source%")
      .maybeSingle();

    if (!existingAction) {
      await supabase.from("call_action_items").insert({
        opportunity_id: opportunityId,
        action: "Review downloaded source document and verify completeness",
        status: "pending",
      });
    }

    const fileSizeKB = Math.round(fileSize / 1024);
    return new Response(
      JSON.stringify({
        success: true,
        message: `Document downloaded (${fileSizeKB} KB, ${contentType})`,
        created_documents: 1,
        total_documents: 1,
        opportunity_id: opportunityId,
        storage_path: storagePath,
        file_size: fileSize,
        content_type: contentType,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("download-call-documents error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/** Upsert a document record with an error state */
async function upsertDocWithError(
  supabase: any,
  opportunityId: string,
  callName: string,
  sourceUrl: string,
  errorMsg: string
) {
  const { data: existing } = await supabase
    .from("call_documents")
    .select("id")
    .eq("opportunity_id", opportunityId)
    .eq("url", sourceUrl)
    .maybeSingle();

  const record = {
    opportunity_id: opportunityId,
    name: `${callName} · Source document`,
    doc_type: "guide",
    url: sourceUrl,
    download_error: errorMsg,
    parsed: false,
  };

  if (existing) {
    await supabase.from("call_documents").update(record).eq("id", existing.id);
  } else {
    await supabase.from("call_documents").insert(record);
  }
}

function guessExtension(contentType: string, url: string): string {
  if (contentType.includes("pdf")) return ".pdf";
  if (contentType.includes("html")) return ".html";
  if (contentType.includes("xml")) return ".xml";
  if (contentType.includes("zip")) return ".zip";
  if (contentType.includes("msword") || contentType.includes("wordprocessingml")) return ".docx";

  // Try from URL
  const urlPath = new URL(url).pathname;
  const urlExt = urlPath.match(/\.(pdf|html|xml|docx|doc|zip|xlsx)$/i);
  if (urlExt) return `.${urlExt[1].toLowerCase()}`;

  return ".bin";
}
