import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  // Auth: get user from JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
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

    // Fetch opportunity (RLS ensures user access via service role + org check)
    const { data: opp, error: oppErr } = await supabaseAdmin
      .from("opportunities")
      .select("*")
      .eq("id", opportunityId)
      .single();

    if (oppErr || !opp) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is org member
    const { data: membership } = await supabaseAdmin
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

    // Fetch documents for this opportunity
    const { data: docs } = await supabaseAdmin
      .from("call_documents")
      .select("name, doc_type, pages, parsed")
      .eq("opportunity_id", opportunityId);

    const hasDocuments = (docs?.length ?? 0) > 0;
    const hasParsedDocs = docs?.some((d: any) => d.parsed) ?? false;
    const basedOnDocs = hasDocuments && hasParsedDocs;

    // Fetch organization profile for context
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("name, type, country, domain_focus")
      .eq("id", opp.organization_id)
      .single();

    const { data: fundingProfile } = await supabaseAdmin
      .from("funding_profiles")
      .select("*")
      .eq("organization_id", opp.organization_id)
      .maybeSingle();

    // Mark as running
    await supabaseAdmin
      .from("opportunities")
      .update({
        assessment_run_status: "running",
        assessment_run_error: null,
        lifecycle: opp.lifecycle === "discovered" || opp.lifecycle === "saved" || opp.lifecycle === "docs_ready"
          ? "assessment_pending"
          : opp.lifecycle,
      })
      .eq("id", opportunityId);

    // If no AI key, we can't run — mark as failed with clear message
    if (!lovableKey) {
      await supabaseAdmin
        .from("opportunities")
        .update({
          assessment_run_status: "failed",
          assessment_run_error: "AI gateway not configured (LOVABLE_API_KEY missing)",
        })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: "AI gateway not configured", status: "failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build prompt with real opportunity data
    const systemPrompt = `You are an expert EU funding advisor performing a detailed eligibility and fit assessment for a specific funding call.

You must assess based on the information provided. Be honest and direct.
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

${hasDocuments ? `Documents available: ${docs!.map((d: any) => `${d.name} (${d.doc_type}, ${d.parsed ? "parsed" : "not parsed"}${d.pages ? `, ${d.pages}p` : ""})`).join("; ")}` : "No official documents downloaded yet."}

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
                eligibility_notes: { type: "string", description: "Detailed eligibility analysis (2-4 sentences)" },
                fit_score: { type: "number", description: "0-100 fit score" },
                fit_notes: { type: "string", description: "Detailed fit analysis (2-4 sentences)" },
                effort_score: { type: "number", description: "0-100 effort/complexity score (higher = more effort)" },
                complexity_notes: { type: "string", description: "Complexity analysis (2-3 sentences)" },
                risks: { type: "array", items: { type: "string" }, description: "2-5 specific risk statements" },
                recommendation: { type: "string", description: "Clear 2-3 sentence recommendation" },
                judgment: { type: "string", enum: ["go", "watch", "no_go"] },
                recommended_action: { type: "string", description: "Single next action statement" },
                blockers: { type: "array", items: { type: "string" }, description: "Current blockers preventing progress, if any" },
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
      console.error("AI gateway error:", aiResponse.status, errText);

      await supabaseAdmin
        .from("opportunities")
        .update({
          assessment_run_status: "failed",
          assessment_run_error: `AI error (${aiResponse.status}): ${errText.slice(0, 200)}`,
        })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: `AI gateway error: ${aiResponse.status}`, status: "failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      await supabaseAdmin
        .from("opportunities")
        .update({
          assessment_run_status: "failed",
          assessment_run_error: "AI returned no structured output",
        })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: "No structured output from AI", status: "failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    // Upsert assessment
    const { error: upsertErr } = await supabaseAdmin
      .from("call_assessments")
      .upsert({
        opportunity_id: opportunityId,
        eligibility: result.eligibility,
        eligibility_notes: result.eligibility_notes ?? "",
        fit_score: Math.max(0, Math.min(100, Math.round(result.fit_score ?? 0))),
        fit_notes: result.fit_notes ?? "",
        effort_score: Math.max(0, Math.min(100, Math.round(result.effort_score ?? 0))),
        complexity_notes: result.complexity_notes ?? "",
        risks: result.risks ?? [],
        recommendation: result.recommendation ?? "",
        judgment: result.judgment ?? "watch",
        based_on_docs: basedOnDocs,
        assessed_at: new Date().toISOString(),
      }, { onConflict: "opportunity_id" });

    if (upsertErr) {
      console.error("Assessment upsert error:", upsertErr);
      await supabaseAdmin
        .from("opportunities")
        .update({
          assessment_run_status: "failed",
          assessment_run_error: `DB error: ${upsertErr.message}`,
        })
        .eq("id", opportunityId);

      return new Response(
        JSON.stringify({ error: `Database error: ${upsertErr.message}`, status: "failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update opportunity with assessment results
    await supabaseAdmin
      .from("opportunities")
      .update({
        assessment_run_status: "completed",
        assessment_run_error: null,
        lifecycle: "assessed",
        fit_score: Math.max(0, Math.min(100, Math.round(result.fit_score ?? 0))),
        effort_score: Math.max(0, Math.min(100, Math.round(result.effort_score ?? 0))),
        recommended_action: result.recommended_action ?? "",
        blockers: result.blockers ?? [],
      })
      .eq("id", opportunityId);

    return new Response(
      JSON.stringify({
        status: "completed",
        opportunityId,
        basedOnDocs,
        judgment: result.judgment,
      }),
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
