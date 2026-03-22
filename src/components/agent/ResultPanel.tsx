import type { TaskResult } from "@/types/agentTask";
import { CheckCircle2, AlertTriangle, FileText, ArrowRight } from "lucide-react";

/**
 * ResultPanel — renders task output robustly.
 * Handles:
 *   - null/undefined structuredOutput
 *   - missing artifacts
 *   - long text blocks (overflow-wrap)
 *   - unknown keys in structuredOutput (renders as JSON)
 */
export function ResultPanel({ result }: { result: TaskResult }) {
  const out = result.structuredOutput;

  // Extract known fields, collect remaining as "other"
  const { eligibility, recommended_programs, estimated_budget_range, key_risks, next_actions, ...otherFields } =
    out ?? {};

  const hasOtherFields = Object.keys(otherFields).length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      {/* Summary */}
      {result.summary && (
        <div className="ink-accent-border">
          <p className="text-[13px] text-foreground leading-relaxed break-words whitespace-pre-wrap">
            {result.summary}
          </p>
        </div>
      )}

      {/* Eligibility */}
      {eligibility && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
          <span className="text-[12px] font-bold text-foreground capitalize">{eligibility}</span>
        </div>
      )}

      {/* Recommended programs */}
      {recommended_programs && recommended_programs.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Recommended Programs</p>
          <div className="flex flex-wrap gap-1.5">
            {recommended_programs.map((p, i) => (
              <span key={i} className="px-2.5 py-1 bg-info/10 text-info text-[11px] font-medium rounded-md border border-info/20">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Budget */}
      {estimated_budget_range && (
        <p className="text-[12px] text-muted-foreground">
          Budget: <span className="font-bold text-foreground">{estimated_budget_range}</span>
        </p>
      )}

      {/* Risks */}
      {key_risks && key_risks.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Risks</p>
          <ul className="space-y-1.5">
            {key_risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/75">
                <AlertTriangle className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                <span className="break-words">{String(r)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next actions */}
      {next_actions && next_actions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Next Actions</p>
          <ul className="space-y-1.5">
            {next_actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80">
                <ArrowRight className="h-3 w-3 text-info mt-0.5 shrink-0" />
                <span className="break-words">{String(a)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Artifacts */}
      {result.artifacts && result.artifacts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Artifacts</p>
          <div className="flex flex-wrap gap-2">
            {result.artifacts.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-[11px] font-medium text-foreground/80">
                <FileText className="h-3 w-3" />
                {a.name || 'Unnamed file'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Other unknown structured fields — render as JSON */}
      {hasOtherFields && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Additional Data</p>
          <pre className="bg-muted/50 border border-border rounded-md p-3 text-[11px] text-foreground/60 font-mono overflow-x-auto whitespace-pre-wrap break-words">
            {JSON.stringify(otherFields, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
