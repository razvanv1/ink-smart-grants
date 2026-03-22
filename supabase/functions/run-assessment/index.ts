import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─────────────────────────────────────────────────────────────
// ASSESSMENT RESULT CONTRACT
// OpenClaw must return this exact shape.
// ─────────────────────────────────────────────────────────────
interface AssessmentResult {
  eligibility: "eligible" | "not_eligible" | "uncertain" | "needs_manual_review";
  eligibility_notes: string;
  fit_score: number;       // 0-100
  fit_notes: string;
  effort_score: number;    // 0-100
  complexity_notes: string;
  risks: string[];         // 2-5 items
  recommendation: string;
  judgment: "go" | "watch" | "no_go";
  recommended_action: string;
  blockers?: string[];
}

interface AssessmentContext {
  opportunity: Record<string, any>;
  organization: Record<string, any> | null;
  fundingProfile: Record<string, any> | null;
  documents: Array<{ name: string; doc_type: string; pages: number | null; parsed: boolean }>;
  basedOnDocs: boolean;
}

// ─────────────────────────────────────────────────────────────
// EXECUTOR: SWAP THIS FOR OPENCLAW
// ─────────────────────────────────────────────────────────────
// This is the ONLY function that needs to change when migrating
// to OpenClaw. Everything else (auth, DB reads, DB writes,
// status management) stays identical.
//
// OpenClaw replacement:
//   1. POST to OpenClaw session/job endpoint with ctx
//   2. Poll or await result
//   3. Return AssessmentResult
//
// Environment variables needed for OpenClaw:
//   - OPENCLAW_API_URL
//   - OPENCLAW_API_KEY
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// DEV/DEMO MODE FLAG
// Set ASSESSMENT_ALLOW_FALLBACK=true to allow Lovable AI fallback.
// In production, only OpenClaw is accepted.
// ─────────────────────────────────────────────────────────────
type ExecutionProvider = "openclaw" | "lovable_ai";

interface ExecutionResult {
  provider: ExecutionProvider;
  result: AssessmentResult;
}

const OPENCLAW_TIMEOUT_MS = 120_000; // 2 minutes

async function executeAssessment(ctx: AssessmentContext): Promise<ExecutionResult> {
  const openclawUrl = Deno.env.get("OPENCLAW_API_URL");
  const openclawKey = Deno.env.get("OPENCLAW_API_KEY");
  const allowFallback = Deno.env.get("ASSESSMENT_ALLOW_FALLBACK") === "true";
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  // ── OpenClaw path (primary) ──
  if (openclawUrl && openclawKey) {
    console.log("[assessment] Provider: openclaw");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENCLAW_TIMEOUT_MS);

    try {
      const response = await fetch(`${openclawUrl}/v1/assessments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openclawKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          opportunity: ctx.opportunity,
          organization: ctx.organization,
          funding_profile: ctx.fundingProfile,
          documents: ctx.documents,
          based_on_docs: ctx.basedOnDocs,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown error");
        throw new Error(`OpenClaw error (${response.status}): ${errText.slice(0, 300)}`);
      }

      const result = await response.json();
      return { provider: "openclaw", result: validateResult(result) };
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        throw new Error(`OpenClaw timeout after ${OPENCLAW_TIMEOUT_MS / 1000}s`);
      }
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }

  // ── No OpenClaw configured ──
  if (!allowFallback) {
    throw new Error(
      "OpenClaw not configured (OPENCLAW_API_URL / OPENCLAW_API_KEY missing). " +
      "Set ASSESSMENT_ALLOW_FALLBACK=true to use Lovable AI in dev/demo mode."
    );
  }

  // ── Lovable AI fallback (dev/demo only) ──
  console.log("[assessment] Provider: lovable_ai (dev/demo fallback)");
  if (!lovableKey) {
    throw new Error("LOVABLE_API_KEY missing — cannot run fallback AI either.");
  }

  const { opportunity: opp, organization: org, fundingProfile, documents: docs, basedOnDocs } = ctx;

  const systemPrompt = `You are an expert EU funding advisor performing a detailed eligibility and fit assessment for a specific funding call.
${basedOnDocs
    ? "Official call documents have been downloaded and parsed. Base your assessment on factual document content."
    : "WARNING: Official call documents have NOT been parsed yet. Your assessment is based on summary information only. Flag this clearly and mark confidence as lower."}

Organization context:
- Name: ${org?.name ?? "Unknown"}
- Type: ${org?.type ?? "Unknown"}
- Country: ${org?.country ?? "Unknown"}
- Domain focus: ${(org?.domain_focus ?? []).join(", ") || "Not specified"}
${fundingProfile ? `- Funding goals: ${fundingProfile.funding_goals ?? "Not specified"}
- Prior experience: ${fundingProfile.prior_experience ?? "Not specified"}
- Internal capacity: ${fundingProfile.internal_capacity ?? "Not specified"}
- Partnership readiness: ${fundingProfile.partnership_readiness ?? "Not specified"}` : ""}

Be specific. Do not generate vague optimism. If eligibility is unclear, say so.`;

  const userPrompt = `Assess this funding opportunity:

Call: ${opp.call_name}
Programme: ${opp.programme}
Thematic area: ${opp.thematic_area}
Funding type: ${opp.funding_type}
Funding range: ${opp.funding_range}
Geography: ${opp.geography}
Deadline: ${opp.deadline ?? "Unknown"}
Summary: ${opp.summary}
Eligibility text: ${opp.eligibility_text}
Complexity: ${opp.complexity}
Partner required: ${opp.partner_required ? "Yes" : "No"}
Why it fits: ${opp.why_it_fits}
Why difficult: ${opp.why_difficult}

${docs.length > 0 ? `Documents available: ${docs.map(d => `${d.name} (${d.doc_type}, ${d.parsed ? "parsed" : "not parsed"}${d.pages ? `, ${d.pages}p` : ""})`).join("; ")}` : "No official documents downloaded yet."}

Provide a thorough assessment.`;

  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: "submit_assessment",
          description: "Submit the structured assessment for this funding opportunity",
          parameters: {
            type: "object",
            properties: {
              eligibility: { type: "string", enum: ["eligible", "not_eligible", "uncertain", "needs_manual_review"] },
              eligibility_notes: { type: "string" },
              fit_score: { type: "number" },
              fit_notes: { type: "string" },
              effort_score: { type: "number" },
              complexity_notes: { type: "string" },
              risks: { type: "array", items: { type: "string" } },
              recommendation: { type: "string" },
              judgment: { type: "string", enum: ["go", "watch", "no_go"] },
              recommended_action: { type: "string" },
              blockers: { type: "array", items: { type: "string" } },
            },
            required: ["eligibility", "eligibility_notes", "fit_score", "fit_notes", "effort_score", "complexity_notes", "risks", "recommendation", "judgment", "recommended_action"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "submit_assessment" } },
    }),
  });

  if (!aiResponse.ok) {
    const errText = await aiResponse.text().catch(() => "Unknown AI error");
    throw new Error(`AI gateway error (${aiResponse.status}): ${errText.slice(0, 300)}`);
  }

  const aiData = await aiResponse.json();
  const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall?.function?.arguments) {
    throw new Error("AI returned no structured output");
  }

  return { provider: "lovable_ai" as ExecutionProvider, result: validateResult(JSON.parse(toolCall.function.arguments)) };
}

function validateResult(raw: any): AssessmentResult {
  return {
    eligibility: raw.eligibility ?? "uncertain",
    eligibility_notes: raw.eligibility_notes ?? "",
    fit_score: Math.max(0, Math.min(100, Math.round(raw.fit_score ?? 0))),
    fit_notes: raw.fit_notes ?? "",
    effort_score: Math.max(0, Math.min(100, Math.round(raw.effort_score ?? 0))),
    complexity_notes: raw.complexity_notes ?? "",
    risks: Array.isArray(raw.risks) ? raw.risks : [],
    recommendation: raw.recommendation ?? "",
    judgment: ["go", "watch", "no_go"].includes(raw.judgment) ? raw.judgment : "watch",
    recommended_action: raw.recommended_action ?? "",
    blockers: Array.isArray(raw.blockers) ? raw.blockers : [],
  };
}

// ─────────────────────────────────────────────────────────────
// EDGE FUNCTION HANDLER
// Auth, data gathering, status management, DB persistence.
// This does NOT change when swapping to OpenClaw.
// ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { opportunityId } = await req.json();
    if (!opportunityId) {
      return new Response(JSON.stringify({ error: "Missing opportunityId" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Fetch opportunity ──
    const { data: opp, error: oppErr } = await supabaseAdmin
      .from("opportunities").select("*").eq("id", opportunityId).single();
    if (oppErr || !opp) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Verify membership ──
    const { data: membership } = await supabaseAdmin
      .from("organization_members").select("id")
      .eq("organization_id", opp.organization_id).eq("user_id", user.id).maybeSingle();
    if (!membership) {
      return new Response(JSON.stringify({ error: "Not authorized for this organization" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Gather context ──
    const { data: docs } = await supabaseAdmin
      .from("call_documents").select("name, doc_type, pages, parsed")
      .eq("opportunity_id", opportunityId);

    const hasDocuments = (docs?.length ?? 0) > 0;
    const hasParsedDocs = docs?.some((d: any) => d.parsed) ?? false;
    const basedOnDocs = hasDocuments && hasParsedDocs;

    const { data: org } = await supabaseAdmin
      .from("organizations").select("name, type, country, domain_focus")
      .eq("id", opp.organization_id).single();

    const { data: fundingProfile } = await supabaseAdmin
      .from("funding_profiles").select("*")
      .eq("organization_id", opp.organization_id).maybeSingle();

    // ── Mark as running ──
    await supabaseAdmin.from("opportunities").update({
      assessment_run_status: "running",
      assessment_run_error: null,
      lifecycle: ["discovered", "saved", "docs_ready"].includes(opp.lifecycle ?? "")
        ? "assessment_pending" : opp.lifecycle,
    }).eq("id", opportunityId);

    // ── Execute assessment (OpenClaw or fallback) ──
    const ctx: AssessmentContext = {
      opportunity: opp,
      organization: org,
      fundingProfile,
      documents: (docs ?? []) as any,
      basedOnDocs,
    };

    let result: AssessmentResult;
    try {
      result = await executeAssessment(ctx);
    } catch (execErr) {
      const errMsg = execErr instanceof Error ? execErr.message : "Unknown execution error";
      console.error("Assessment execution failed:", errMsg);

      await supabaseAdmin.from("opportunities").update({
        assessment_run_status: "failed",
        assessment_run_error: errMsg.slice(0, 500),
      }).eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: errMsg, status: "failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Persist results ──
    const { error: upsertErr } = await supabaseAdmin
      .from("call_assessments")
      .upsert({
        opportunity_id: opportunityId,
        eligibility: result.eligibility,
        eligibility_notes: result.eligibility_notes,
        fit_score: result.fit_score,
        fit_notes: result.fit_notes,
        effort_score: result.effort_score,
        complexity_notes: result.complexity_notes,
        risks: result.risks,
        recommendation: result.recommendation,
        judgment: result.judgment,
        based_on_docs: basedOnDocs,
        assessed_at: new Date().toISOString(),
      }, { onConflict: "opportunity_id" });

    if (upsertErr) {
      console.error("Assessment upsert error:", upsertErr);
      await supabaseAdmin.from("opportunities").update({
        assessment_run_status: "failed",
        assessment_run_error: `DB error: ${upsertErr.message}`,
      }).eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: `Database error: ${upsertErr.message}`, status: "failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabaseAdmin.from("opportunities").update({
      assessment_run_status: "completed",
      assessment_run_error: null,
      lifecycle: "assessed",
      fit_score: result.fit_score,
      effort_score: result.effort_score,
      recommended_action: result.recommended_action,
      blockers: result.blockers ?? [],
    }).eq("id", opportunityId);

    return new Response(
      JSON.stringify({ status: "completed", opportunityId, basedOnDocs, judgment: result.judgment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("run-assessment error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", status: "failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
