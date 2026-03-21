import { workflows } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const stageOrder = ['Created', 'Scoping', 'Drafting', 'Inputs Pending', 'Review', 'Compliance Check', 'Ready to Submit', 'Submitted'];

const Workflows = () => {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Application Execution</p>
          <h1 className="ink-page-title">Workflows</h1>
        </div>
        <span className="text-[11px] text-muted-foreground pb-1">{workflows.length} active</span>
      </div>

      {/* Workflow rows — more editorial */}
      <div>
        {workflows.map(wf => {
          const stageIndex = stageOrder.indexOf(wf.stage);
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
                  <p className="text-[11px] text-muted-foreground">{wf.opportunityName} · {wf.owner} · {wf.deadline}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  {/* Stage progression — geometric blocks */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-[2px]">
                      {stageOrder.map((_, i) => (
                        <div key={i} className={`h-3 w-[5px] rounded-[1px] ${i <= stageIndex ? 'bg-foreground' : 'bg-border'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground w-24">{wf.stage}</span>
                  </div>
                  <ReadinessBar score={wf.readinessScore} segments={8} />
                  <StatusChip status={wf.status} dot />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

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
