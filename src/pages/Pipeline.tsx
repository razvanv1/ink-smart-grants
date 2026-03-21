import { pipelineStages, getOpportunitiesByStage, workflows } from "@/data/sampleData";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { Link } from "react-router-dom";

const Pipeline = () => {
  const atRisk = workflows.filter(w => w.status === 'at-risk').length;
  const totalActive = workflows.filter(w => w.status !== 'completed').length;
  const submitted = workflows.filter(w => w.status === 'completed').length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Execution Pipeline</p>
          <h1 className="ink-page-title">Pipeline</h1>
        </div>
        <div className="flex items-center gap-4 pb-1">
          <span className="text-[11px] text-muted-foreground">{totalActive} active · {submitted} submitted · {atRisk} at risk</span>
        </div>
      </div>

      <AgentActionPanel
        context={`${atRisk} workflow${atRisk !== 1 ? 's' : ''} at risk · Nearest deadline in ${Math.max(0, Math.ceil((new Date(workflows.filter(w => w.status !== 'completed').sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]?.deadline || Date.now()).getTime() - Date.now()) / 86400000))} days`}
        actions={[
          { label: 'Prioritize this week', variant: 'strategic', primary: true },
          ...(atRisk > 0 ? [{ label: 'Flag at-risk workflows', variant: 'compliance' as const, primary: true }] : []),
          { label: 'Detect capacity overload', variant: 'coordination' },
        ]}
      />

      <div className="flex gap-5 overflow-x-auto pb-4">
        {pipelineStages.map(stage => {
          const opps = getOpportunitiesByStage(stage);
          const hasItems = opps.length > 0;
          return (
            <div key={stage} className="flex-shrink-0 w-48">
              <div className="flex items-center gap-2 mb-4">
                <div className={`h-2.5 w-2.5 rounded-[2px] ${hasItems ? 'bg-foreground' : 'bg-border'}`} />
                <h3 className="text-[10px] font-bold text-foreground tracking-[0.12em] uppercase">{stage}</h3>
                <span className="text-[10px] text-muted-foreground ml-auto" style={{ fontVariantNumeric: 'tabular-nums' }}>{opps.length}</span>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {opps.map(opp => {
                  const wf = workflows.find(w => w.opportunityId === opp.id);
                  const isAtRisk = wf?.status === 'at-risk';
                  return (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className={`block border-l-2 ${isAtRisk ? 'border-destructive' : 'border-foreground'} pl-3 py-2.5 hover:bg-secondary/30 transition-colors rounded-r`}
                    >
                      <p className="text-[12px] font-semibold text-foreground leading-snug mb-1">{opp.callName}</p>
                      <p className="text-[10px] text-muted-foreground mb-2">{opp.programme}</p>
                      <div className="flex items-center justify-between">
                        <ScoreBadge score={opp.fitScore} />
                        <UrgencyIndicator urgency={opp.urgency} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</p>
                      {isAtRisk && (
                        <p className="text-[10px] text-destructive font-semibold mt-1">{wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}</p>
                      )}
                    </Link>
                  );
                })}
                {opps.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-[10px] text-muted-foreground/50 border-l border-dashed border-border pl-3">
                    —
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
