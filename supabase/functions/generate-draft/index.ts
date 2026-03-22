import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth guard — require a valid JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseAuth.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Body size guard
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 50_000) {
      return new Response(
        JSON.stringify({ error: "Request body too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { opportunity, workflow, existingSections } = body;

    // Schema validation
    if (!opportunity || typeof opportunity !== "object" || !workflow || typeof workflow !== "object") {
      return new Response(
        JSON.stringify({ error: "Missing required fields: opportunity, workflow" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate helper to cap string lengths
    const cap = (val: unknown, max: number): string => {
      if (typeof val !== "string") return "";
      return val.length > max ? val.slice(0, max) : val;
    };

    // Sanitize inputs with length limits
    const safeOpp = {
      callName: cap(opportunity.callName, 300),
      programme: cap(opportunity.programme, 200),
      thematicArea: cap(opportunity.thematicArea, 200),
      fundingType: cap(opportunity.fundingType, 100),
      fundingRange: cap(opportunity.fundingRange, 100),
      geography: cap(opportunity.geography, 200),
      summary: cap(opportunity.summary, 2000),
      whyItFits: cap(opportunity.whyItFits, 1000),
      partnerRequired: Boolean(opportunity.partnerRequired),
      complexity: cap(opportunity.complexity, 50),
    };

    const safeWorkflow = {
      name: cap(workflow.name, 300),
      stage: cap(workflow.stage, 100),
      deadline: cap(workflow.deadline, 30),
    };

    const safeSections = Array.isArray(existingSections)
      ? existingSections.slice(0, 20).map((s: any) => ({ name: cap(s?.name, 200) }))
      : [];

    const systemPrompt = `You are an expert grant writer and proposal architect. You help organizations build structured funding proposals.

Given a funding opportunity and workflow context, generate a proposal section structure with concrete guidance for each section.

Return a JSON object with a "sections" array. Each section must have:
- "name": section title (e.g. "Problem / Need", "Objectives", "Activities & Work Packages")
- "status": one of "drafted", "in-progress", "todo"
- "readiness": number 0-100 representing draft completeness
- "guidance": 2-3 sentence specific guidance for writing this section, referencing the opportunity details
- "suggestedLength": approximate word count recommendation
- "keyPoints": array of 2-4 bullet points that should be covered
- "reusableFrom": optional string naming a past document that could be reused (if applicable)

Generate 6-8 sections appropriate for this type of funding call. Make guidance specific to the opportunity, not generic.`;

    const userPrompt = `Funding Opportunity:
- Call: ${opportunity.callName}
- Programme: ${opportunity.programme}
- Thematic Area: ${opportunity.thematicArea}
- Funding Type: ${opportunity.fundingType}
- Funding Range: ${opportunity.fundingRange}
- Geography: ${opportunity.geography}
- Summary: ${opportunity.summary}
- Why it fits: ${opportunity.whyItFits}
- Partner required: ${opportunity.partnerRequired ? "Yes" : "No"}
- Complexity: ${opportunity.complexity}

Workflow: ${workflow.name}
Stage: ${workflow.stage}
Deadline: ${workflow.deadline}

${existingSections?.length ? `Existing sections already in progress: ${existingSections.map((s: any) => s.name).join(", ")}` : "No existing sections yet."}

Generate the proposal section structure now.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_proposal_structure",
                description:
                  "Generate a structured proposal section outline for a funding application",
                parameters: {
                  type: "object",
                  properties: {
                    sections: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          status: {
                            type: "string",
                            enum: ["drafted", "in-progress", "todo"],
                          },
                          readiness: { type: "number" },
                          guidance: { type: "string" },
                          suggestedLength: { type: "number" },
                          keyPoints: {
                            type: "array",
                            items: { type: "string" },
                          },
                          reusableFrom: { type: "string" },
                        },
                        required: [
                          "name",
                          "status",
                          "readiness",
                          "guidance",
                          "suggestedLength",
                          "keyPoints",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["sections"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "generate_proposal_structure" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds at Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured output from AI");
    }

    const sections = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(sections), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-draft error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
