import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { opportunityId } = await req.json();
    if (!opportunityId) {
      return new Response(JSON.stringify({ error: "Missing required field: opportunityId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const anonClient = createClient(supabaseUrl, anonKey);

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authErr,
    } = await anonClient.auth.getUser(token);

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: opp, error: oppErr } = await supabase
      .from("opportunities")
      .select("id, organization_id, source_url, call_name, lifecycle")
      .eq("id", opportunityId)
      .maybeSingle();

    if (oppErr) throw oppErr;
    if (!opp) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: membership, error: memErr } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", opp.organization_id)
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (memErr) throw memErr;
    if (!membership) {
      return new Response(JSON.stringify({ error: "You do not have access to this opportunity" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingDocs, error: docsErr } = await supabase
      .from("call_documents")
      .select("id")
      .eq("opportunity_id", opportunityId);

    if (docsErr) throw docsErr;

    if ((existingDocs?.length ?? 0) > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Documents already exist for this call",
          created_documents: 0,
          total_documents: existingDocs?.length ?? 0,
          opportunity_id: opportunityId,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!opp.source_url) {
      return new Response(JSON.stringify({ error: "This call has no source URL. Add a source URL first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = new Date().toISOString();
    const docName = `${opp.call_name} · Official source document`;

    const { error: insertDocErr } = await supabase.from("call_documents").insert({
      opportunity_id: opportunityId,
      name: docName,
      doc_type: "guide",
      url: opp.source_url,
      downloaded_at: nowIso,
      parsed: false,
    });

    if (insertDocErr) throw insertDocErr;

    const lifecycleUpdate = opp.lifecycle === "discovered" || opp.lifecycle === "saved"
      ? { lifecycle: "docs_pending", docs_status: "docs_pending" }
      : { docs_status: "docs_pending" };

    const { error: updateOppErr } = await supabase
      .from("opportunities")
      .update(lifecycleUpdate)
      .eq("id", opportunityId);

    if (updateOppErr) throw updateOppErr;

    const { data: existingReviewTask, error: existingTaskErr } = await supabase
      .from("call_action_items")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .ilike("action", "%review source%")
      .limit(1)
      .maybeSingle();

    if (existingTaskErr) throw existingTaskErr;

    if (!existingReviewTask) {
      const { error: actionErr } = await supabase.from("call_action_items").insert({
        opportunity_id: opportunityId,
        action: "Review source and upload official guide/annexes",
        status: "pending",
      });
      if (actionErr) throw actionErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Document ingestion started",
        created_documents: 1,
        total_documents: 1,
        opportunity_id: opportunityId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("download-call-documents error:", err);
    return new Response(JSON.stringify({ error: err.message ?? "Unexpected error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
