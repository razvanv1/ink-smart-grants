import { opportunities, pipelineStages, getOpportunitiesByStage } from "@/data/sampleData";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";

const Pipeline = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Pipeline</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map(stage => {
          const opps = getOpportunitiesByStage(stage);
          return (
            <div key={stage} className="flex-shrink-0 w-52">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stage}</h3>
                <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opps.length}</span>
              </div>
              <div className="space-y-2 min-h-[180px]">
                {opps.map(opp => (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="block rounded border border-border p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <p className="text-[12px] font-medium text-foreground leading-snug mb-1.5">{opp.callName}</p>
                    <p className="text-[11px] text-muted-foreground mb-2">{opp.programme}</p>
                    <div className="flex items-center justify-between">
                      <ScoreBadge score={opp.fitScore} />
                      <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</span>
                    </div>
                  </Link>
                ))}
                {opps.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-[11px] text-muted-foreground border border-dashed border-border rounded">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
