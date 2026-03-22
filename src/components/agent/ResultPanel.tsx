import type { TaskResult } from "@/types/agentTask";
import { CheckCircle2, AlertTriangle, FileText, ArrowRight } from "lucide-react";

export function ResultPanel({ result }: { result: TaskResult }) {
  const out = result.structuredOutput;
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <div className="ink-accent-border">
        <p className="text-[13px] text-foreground leading-relaxed">{result.summary}</p>
      </div>

      {out?.eligibility && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
          <span className="text-[12px] font-bold text-foreground capitalize">{out.eligibility}</span>
        </div>
      )}

      {out?.estimated_budget_range && (
        <p className="text-[12px] text-muted-foreground">Budget: <span className="font-bold text-foreground">{out.estimated_budget_range}</span></p>
      )}

      {out?.key_risks && out.key_risks.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Risks</p>
          <ul className="space-y-1">
            {out.key_risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/75">
                <AlertTriangle className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {out?.next_actions && out.next_actions.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Next Actions</p>
          <ul className="space-y-1">
            {out.next_actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/80">
                <ArrowRight className="h-3 w-3 text-info mt-0.5 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.artifacts && result.artifacts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Artifacts</p>
          <div className="flex flex-wrap gap-2">
            {result.artifacts.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-[11px] font-medium text-foreground/80">
                <FileText className="h-3 w-3" />
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
