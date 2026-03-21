import { workflows } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";

const stageOrder = ['Created', 'Scoping', 'Drafting', 'Inputs Pending', 'Review', 'Compliance Check', 'Ready to Submit', 'Submitted'];

const Workflows = () => {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Workflows</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Application workflows across all opportunities</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
          <Plus className="h-4 w-4" /> New Workflow
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Workflow</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Opportunity</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Stage</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Owner</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Readiness</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Deadline</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workflows.map(wf => (
              <tr key={wf.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <Link to={`/workflows/${wf.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    {wf.name}
                  </Link>
                </td>
                <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{wf.opportunityName}</td>
                <td className="p-3">
                  <StageIndicator stage={wf.stage} />
                </td>
                <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{wf.owner}</td>
                <td className="p-3 w-40">
                  <ReadinessBar score={wf.readinessScore} />
                </td>
                <td className="p-3 text-sm text-muted-foreground tabular-nums hidden sm:table-cell">{wf.deadline}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <StatusChip status={wf.status} />
                    {wf.blockers > 0 && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {wf.blockers}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {workflows.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-foreground mb-1">No workflows yet</p>
            <p className="text-xs text-muted-foreground">Start a workflow from any shortlisted opportunity</p>
          </div>
        )}
      </div>
    </div>
  );
};

function StageIndicator({ stage }: { stage: string }) {
  const stageIndex = stageOrder.indexOf(stage);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {stageOrder.slice(0, 7).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-full ${i <= stageIndex ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">{stage}</span>
    </div>
  );
}

export default Workflows;
