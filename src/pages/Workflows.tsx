import { workflows, workflowStages } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Workflows = () => {
  const active = workflows.filter(w => w.status !== 'completed');
  const completed = workflows.filter(w => w.status === 'completed');
  const atRisk = workflows.filter(w => w.status === 'at-risk').length;
  const totalBlockers = workflows.reduce((s, w) => s + w.blockers, 0);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Application Execution</p>
          <h1 className="ink-page-title">Workflows</h1>
        </div>
        <div className="flex items-center gap-4 pb-1">
          <span className="text-[11px] text-muted-foreground">{active.length} active · {completed.length} completed</span>
        </div>
      </div>

      {(atRisk > 0 || totalBlockers > 0) && (
        <AgentActionPanel
          context={`${atRisk} at risk · ${totalBlockers} blockers across all workflows`}
          actions={[
            { label: 'Review readiness', variant: 'compliance', primary: true },
            { label: 'Surface blockers', variant: 'coordination' },
          ]}
        />
      )}

      <div>
        {active.map(wf => {
          const stageIndex = workflowStages.indexOf(wf.stage);
          const daysLeft = Math.max(0, Math.ceil((new Date(wf.deadline).getTime() - Date.now()) / 86400000));
          return (
            <Link key={wf.id} to={`/workflows/${wf.id}`} className="block py-5 border-b border-border/60 hover:bg-secondary/20 -mx-4 px-4 rounded transition-colors group">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight truncate">{wf.name}</p>
                    {wf.blockers > 0 && (
                      <span className="text-[10px] text-destructive font-bold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                        <AlertTriangle className="h-3 w-3" />{wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{wf.opportunityName} · {wf.owner}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-[2px]">
                      {workflowStages.map((_, i) => (
                        <div key={i} className={`h-3 w-[5px] rounded-[1px] ${i <= stageIndex ? 'bg-foreground' : 'bg-border'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground w-24">{wf.stage}</span>
                  </div>
                  <div className="text-right w-12">
                    <span className={`text-[12px] font-bold ${daysLeft <= 7 ? 'text-destructive' : daysLeft <= 21 ? 'text-warning' : 'text-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{daysLeft}d</span>
                  </div>
                  <ReadinessBar score={wf.readinessScore} segments={8} />
                  <StatusChip status={wf.status} dot />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {completed.length > 0 && (
        <>
          <div className="ink-rule" />
          <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Completed</h2>
          {completed.map(wf => (
            <Link key={wf.id} to={`/workflows/${wf.id}`} className="block py-4 border-b border-border/40 hover:bg-secondary/20 -mx-4 px-4 rounded transition-colors group opacity-60 hover:opacity-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">{wf.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{wf.opportunityName} · Submitted {wf.deadline}</p>
                </div>
                <StatusChip status={wf.status} dot />
              </div>
            </Link>
          ))}
        </>
      )}

      {workflows.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-[13px] text-foreground font-semibold">No active workflows</p>
          <p className="text-[12px] text-muted-foreground mt-1">Start from a shortlisted opportunity</p>
        </div>
      )}
    </div>
  );
};

export default Workflows;
