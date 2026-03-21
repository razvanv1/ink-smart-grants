import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { opportunity, workflow, existingSections } = await req.json();

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
