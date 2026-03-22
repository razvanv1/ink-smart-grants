import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { projectIntent, organizationType, primaryDomain, filters } = await req.json();

    if (!projectIntent || !organizationType || !primaryDomain) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: projectIntent, organizationType, primaryDomain" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert EU funding advisor with deep knowledge of the EU Funding & Tenders Portal (https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals).

You have authoritative knowledge of all EU funding programmes for the 2021-2027 period including: Horizon Europe, Erasmus+, Digital Europe Programme (DIGITAL), ESF+, CERV, Creative Europe, LIFE, Innovation Fund, Interreg, Connecting Europe Facility (CEF), EU4Health, Single Market Programme (SMP), InvestEU, European Defence Fund (EDF), and national/regional grants.

The EU F&T Portal classifies calls into three grant types:
1. "Direct calls for proposals" issued directly by EU institutions (DG Research, EACEA, HaDEA, REA, CINEA, etc.)
2. "EU External Actions" managed by DG INTPA, DG NEAR, FPI for non-EU countries
3. "Calls for funding in cascade" (also called cascade/sub-granting) issued by EU-funded projects that redistribute funding to third parties

CRITICAL MATCHING RULES:
- Use REAL call naming conventions from the portal (e.g. HORIZON-CL4-2026-HUMAN-01-03, ERASMUS-EDU-2026-PI-ALL-LOT1, DIGITAL-2026-SKILLS-04)
- Use realistic deadlines (3-12 months from now), budgets that match programme norms, and correct eligibility criteria
- Match based on thematic alignment, eligible organization types, TRL levels, and geographic scope
- The more detailed the user's project description, the more precise and differentiated the matching should be
- Score fitScore honestly: a 95%+ match should only happen when project intent perfectly aligns with the call topic
- Include a mix of high-fit (80%+) and moderate-fit (50-79%) calls to show breadth
- When a grant type filter is specified, only return calls of that type
- When a funding status filter is specified, respect it (Open = deadline in the future, Forthcoming = not yet open, Closed = past deadline)
- The fundingType field in results must use one of the three official grant types above

Return 8 matched calls ranked by fit score (highest first). Make the matching logic transparent. Explain WHY each call matches or doesn't fully match.`;

    const userPrompt = `Project intent: "${projectIntent}"
Organization type: ${organizationType}
Primary domain: ${primaryDomain}
${filters?.budgetRange ? `Budget range: ${filters.budgetRange}` : ""}
${filters?.geography ? `Geography preference: ${filters.geography}` : ""}
${filters?.fundingStatus ? `Funding status filter: ${filters.fundingStatus}` : "Status: Open (default)"}
${filters?.grantType ? `Grant type filter: ${filters.grantType}` : ""}

Find the most relevant EU and national funding calls for this profile using the official EU Funding & Tenders Portal taxonomy. Return exactly 8 calls.`;

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
                name: "return_matched_calls",
                description: "Return matched EU funding calls ranked by fit score",
                parameters: {
                  type: "object",
                  properties: {
                    matches: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          callId: { type: "string", description: "Realistic EU call identifier" },
                          callName: { type: "string", description: "Full call title" },
                          programme: { type: "string", description: "Funding programme name" },
                          fitScore: { type: "number", description: "0-100 fit score" },
                          effortScore: { type: "number", description: "0-100 effort/complexity score" },
                          urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
                          deadline: { type: "string", description: "YYYY-MM-DD format" },
                          fundingRange: { type: "string", description: "Budget range e.g. €250K – €400K" },
                          geography: { type: "string" },
                          thematicArea: { type: "string" },
                          fundingType: { type: "string" },
                          whyItFits: { type: "string", description: "2-3 sentences on why this matches" },
                          whyDifficult: { type: "string", description: "1-2 sentences on challenges" },
                          complexity: { type: "string", enum: ["low", "medium", "high"] },
                          partnerRequired: { type: "boolean" },
                          recommendedAction: { type: "string", enum: ["Start Workflow", "Review", "Watch", "Needs More Info", "Needs Partner"] },
                        },
                        required: ["callId", "callName", "programme", "fitScore", "effortScore", "urgency", "deadline", "fundingRange", "geography", "thematicArea", "fundingType", "whyItFits", "whyDifficult", "complexity", "partnerRequired", "recommendedAction"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["matches"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_matched_calls" },
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
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
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

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("funding-scan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
