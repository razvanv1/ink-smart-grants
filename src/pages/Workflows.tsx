import { workflows } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const stageOrder = ['Created', 'Scoping', 'Drafting', 'Inputs Pending', 'Review', 'Compliance Check', 'Ready to Submit', 'Submitted'];

const Workflows = () => {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Workflows</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Workflow</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Stage</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden lg:table-cell">Owner</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider w-36">Readiness</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden sm:table-cell">Deadline</th>
              <th className="text-right py-2.5 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(wf => {
              const stageIndex = stageOrder.indexOf(wf.stage);
              return (
                <tr key={wf.id} className="border-b border-border/60 hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <Link to={`/workflows/${wf.id}`} className="text-[13px] font-medium text-foreground hover:text-primary transition-colors">
                      {wf.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5 hidden md:block">{wf.opportunityName}</p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-[3px]">
                        {stageOrder.slice(0, 7).map((_, i) => (
                          <div key={i} className={`h-1 w-2.5 rounded-sm ${i <= stageIndex ? 'bg-foreground' : 'bg-secondary'}`} />
                        ))}
                      </div>
                      <span className="text-[12px] text-muted-foreground">{wf.stage}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] text-muted-foreground hidden lg:table-cell">{wf.owner}</td>
                  <td className="py-3.5 pr-4"><ReadinessBar score={wf.readinessScore} /></td>
                  <td className="py-3.5 pr-4 text-[13px] text-muted-foreground hidden sm:table-cell" style={{ fontVariantNumeric: 'tabular-nums' }}>{wf.deadline}</td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {wf.blockers > 0 && (
                        <span className="text-[11px] text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />{wf.blockers}
                        </span>
                      )}
                      <StatusChip status={wf.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {workflows.length === 0 && (
        <p className="py-20 text-center text-sm text-muted-foreground">No active workflows</p>
      )}
    </div>
  );
};

export default Workflows;
