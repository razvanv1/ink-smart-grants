import { useSavedCalls, getLifecycleLabel } from "@/hooks/useOpportunities";
import type { OpportunityFull } from "@/hooks/useOpportunities";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

const Pipeline = () => {
  const { data: saved = [], isLoading, error } = useSavedCalls();
  const withBlockers = saved.filter(o => (o.blockers?.length ?? 0) > 0);
  const urgent = saved.filter(o => o.urgency === 'critical' || o.urgency === 'high');
  const needsDocs = saved.filter(o => o.docs_status !== 'docs_ready');

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1300px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-[1300px] mx-auto">
        <div className="py-20 text-center">
          <p className="text-[13px] text-destructive font-semibold">Failed to load pipeline</p>
          <p className="text-[12px] text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Saved Calls & Progress</p>
          <h1 className="ink-page-title">Pipeline</h1>
        </div>
        <div className="flex items-center gap-4 pb-1">
          <span className="text-[11px] text-muted-foreground">
            {saved.length} saved · {urgent.length} urgent · {withBlockers.length} blocked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard label="Urgent" value={urgent.length} accent={urgent.length > 0} />
        <SummaryCard label="Blocked" value={withBlockers.length} accent={withBlockers.length > 0} />
        <SummaryCard label="Docs Missing" value={needsDocs.length} />
        <SummaryCard label="Go Decisions" value={saved.filter(o => o.assessment?.judgment === 'go').length} />
      </div>

      <div>
        {[...saved]
          .sort((a, b) => {
            const prio = { high: 0, medium: 1, low: 2 };
            if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority];
            const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
            const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
            return da - db;
          })
          .map(opp => {
            const daysLeft = opp.deadline ? Math.max(0, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000)) : null;
            const hasBlockers = (opp.blockers?.length ?? 0) > 0;
            const nextAction = opp.action_items?.find(a => a.status !== 'done');
            return (
              <Link
                key={opp.id}
                to={`/opportunities/${opp.id}`}
                className="block py-5 border-b border-border/60 hover:bg-secondary/20 -mx-4 px-4 rounded transition-colors group"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight truncate">
                        {opp.call_name}
                      </p>
                      {hasBlockers && (
                        <span className="text-[10px] text-destructive font-bold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                          <AlertTriangle className="h-3 w-3" />{opp.blockers.length}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {opp.programme} · {opp.funding_range}
                    </p>
                    {nextAction && (
                      <p className="text-[11px] text-foreground/60 mt-1.5 flex items-center gap-1">
                        <ArrowRight className="h-2.5 w-2.5 text-primary" />
                        <span className="font-medium">Next:</span> {nextAction.action}
                        {nextAction.owner && <span className="text-muted-foreground"> · {nextAction.owner}</span>}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-center w-12">
                      <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-0.5">Fit</p>
                      <ScoreBadge score={opp.fit_score} />
                    </div>
                    <div className="text-center w-16">
                      <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-0.5">Status</p>
                      <StatusChip status={opp.lifecycle} />
                    </div>
                    {opp.assessment && (
                      <div className="text-center w-14 hidden md:block">
                        <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-0.5">Judgment</p>
                        <StatusChip status={opp.assessment.judgment} dot />
                      </div>
                    )}
                    <div className="text-center w-10 hidden md:block">
                      <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-0.5">Urgency</p>
                      <UrgencyIndicator urgency={opp.urgency} />
                    </div>
                    {daysLeft !== null && (
                      <div className="text-right w-14">
                        <p className={`text-[13px] font-bold ${daysLeft <= 7 ? 'text-destructive' : daysLeft <= 21 ? 'text-warning' : 'text-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {daysLeft}d
                        </p>
                        <p className="text-[10px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      {saved.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-[13px] text-foreground font-semibold">No saved calls yet</p>
          <p className="text-[12px] text-muted-foreground mt-1">Save opportunities from the Opportunities page to track them here</p>
        </div>
      )}
    </div>
  );
};

function SummaryCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={accent ? 'ink-accent-border' : ''}>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium mb-1">{label}</p>
      <p className="ink-score">{value}</p>
    </div>
  );
}

export default Pipeline;
