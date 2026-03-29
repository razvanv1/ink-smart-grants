import { useParams, Link } from "react-router-dom";
import { useOpportunityDetail } from "@/hooks/useOpportunities";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Loader2, Play, FileText, CheckCircle2, Clock,
  AlertTriangle, BookOpen, RotateCcw,
} from "lucide-react";

interface DraftSection {
  name: string;
  status: "drafted" | "in-progress" | "todo";
  readiness: number;
  guidance: string;
  suggestedLength: number;
  keyPoints: string[];
  reusableFrom?: string;
}

const statusIcons: Record<string, typeof Clock> = {
  drafted: CheckCircle2,
  "in-progress": Clock,
  todo: AlertTriangle,
};

const statusColors: Record<string, string> = {
  drafted: "text-[hsl(var(--success))]",
  "in-progress": "text-info",
  todo: "text-muted-foreground",
};

const statusBg: Record<string, string> = {
  drafted: "bg-[hsl(var(--success)/0.1)]",
  "in-progress": "bg-info/10",
  todo: "bg-muted/60",
};

const WorkflowDetail = () => {
  const { id } = useParams();
  const { data: opp, isLoading, error } = useOpportunityDetail(id);
  const [generating, setGenerating] = useState(false);
  const [sections, setSections] = useState<DraftSection[] | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!opp) return;
    setGenerating(true);
    setGenError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-draft", {
        body: {
          opportunity: {
            callName: opp.call_name,
            programme: opp.programme,
            thematicArea: opp.thematic_area,
            fundingType: opp.funding_type,
            fundingRange: opp.funding_range,
            geography: opp.geography,
            summary: opp.summary,
            whyItFits: opp.why_it_fits,
            partnerRequired: opp.partner_required,
            complexity: opp.complexity,
          },
          workflow: {
            name: `Proposal for ${opp.call_name}`,
            stage: opp.lifecycle || "drafting",
            deadline: opp.deadline || "TBD",
          },
          existingSections: sections?.map((s) => ({ name: s.name })) || [],
        },
      });

      if (fnError) {
        const err = fnError as { context?: Response; message?: string };
        if (err?.context) {
          try {
            const payload = await err.context.json();
            if (payload?.error) throw new Error(payload.error);
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== err?.message) throw parseErr;
          }
        }
        throw new Error(err?.message || "Failed to generate draft");
      }

      if (data?.sections) {
        setSections(data.sections);
        toast.success(`Generated ${data.sections.length} proposal sections`);
      } else {
        throw new Error("No sections returned");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setGenError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1060px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="p-8 max-w-[1060px] mx-auto text-center py-24">
        <AlertTriangle className="h-7 w-7 text-destructive mx-auto mb-3" />
        <p className="text-[14px] font-bold text-foreground">Opportunity not found</p>
        <Link to="/workflows" className="text-[12px] text-info hover:underline mt-2 inline-block">
          ← Back to Workflows
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1100px] mx-auto space-y-6">
      {/* Back link */}
      <Link
        to="/workflows"
        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <ArrowLeft className="h-3 w-3" /> Workflows
      </Link>

      {/* Header */}
      <div className="border-b border-border pb-6">
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">
          Proposal Drafting
        </p>
        <h1 className="ink-page-title text-[22px] leading-tight">{opp.call_name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span>{opp.programme}</span>
          {opp.thematic_area && <span>· {opp.thematic_area}</span>}
          {opp.deadline && (
            <span>· Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Generate button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="ink-glow-info flex items-center gap-2 px-5 py-2.5 bg-info text-info-foreground text-[12px] font-bold rounded-full disabled:opacity-50 transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating…
            </>
          ) : sections ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              Re-generate Structure
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Generate Draft Structure
            </>
          )}
        </button>

        {sections && (
          <span className="text-[11px] text-muted-foreground">
            {sections.length} sections generated
          </span>
        )}
      </div>

      {/* Error */}
      {genError && (
        <div className="bg-destructive/10 border border-destructive/25 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-foreground">Generation failed</p>
            <p className="text-[11px] text-muted-foreground mt-1">{genError}</p>
          </div>
        </div>
      )}

      {/* Sections grid */}
      {sections && sections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
            Proposal Structure
          </h2>

          <div className="grid gap-3">
            {sections.map((section, idx) => {
              const Icon = statusIcons[section.status] || Clock;
              const color = statusColors[section.status] || "text-muted-foreground";
              const bg = statusBg[section.status] || "bg-muted/60";

              return (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-5 hover:border-foreground/15 transition-all"
                >
                  {/* Section header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-md ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-foreground">{section.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>
                            {section.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ~{section.suggestedLength} words
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Readiness bar */}
                    <div className="text-right shrink-0">
                      <span className="text-[18px] font-extrabold text-foreground tabular-nums">
                        {section.readiness}%
                      </span>
                      <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-info rounded-full transition-all"
                          style={{ width: `${section.readiness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guidance */}
                  <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">
                    {section.guidance}
                  </p>

                  {/* Key points */}
                  {section.keyPoints.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Key Points
                      </p>
                      <ul className="space-y-1">
                        {section.keyPoints.map((pt, i) => (
                          <li key={i} className="text-[11px] text-foreground/80 flex items-start gap-2">
                            <span className="text-info mt-1">•</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reusable from */}
                  {section.reusableFrom && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      Reusable from: <span className="font-medium">{section.reusableFrom}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state before generation */}
      {!sections && !generating && !genError && (
        <div className="py-16 text-center">
          <FileText className="h-7 w-7 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-[14px] text-muted-foreground mb-1">No draft generated yet</p>
          <p className="text-[12px] text-muted-foreground/70">
            Click "Generate Draft Structure" to create a proposal outline for this opportunity.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkflowDetail;
