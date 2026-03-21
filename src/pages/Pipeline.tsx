import { opportunities, pipelineStages, getOpportunitiesByStage } from "@/data/sampleData";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";

const stageColors: Record<string, string> = {
  'Identified': 'border-t-muted-foreground',
  'Watchlist': 'border-t-info',
  'Shortlisted': 'border-t-warning',
  'Active': 'border-t-primary',
  'In Review': 'border-t-purple-500',
  'Ready to Submit': 'border-t-success',
  'Submitted': 'border-t-success',
};

const Pipeline = () => {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Macro view of funding execution</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipelineStages.map(stage => {
          const opps = getOpportunitiesByStage(stage);
          return (
            <div key={stage} className="flex-shrink-0 w-56">
              <div className={`rounded-lg border border-border bg-card border-t-2 ${stageColors[stage] || 'border-t-muted'}`}>
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{stage}</h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{opps.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 min-h-[200px]">
                  {opps.map(opp => (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className="block rounded-md border border-border bg-background p-3 hover:shadow-sm transition-shadow"
                    >
                      <p className="text-xs font-medium text-foreground leading-snug mb-2">{opp.callName}</p>
                      <p className="text-[11px] text-muted-foreground mb-2">{opp.programme}</p>
                      <div className="flex items-center justify-between">
                        <ScoreBadge score={opp.fitScore} />
                        <UrgencyIndicator urgency={opp.urgency} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2 tabular-nums">{opp.deadline}</p>
                    </Link>
                  ))}
                  {opps.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                      No items
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
