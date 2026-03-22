import { MetricCard } from "@/components/shared/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { opportunities, agentEvents, getSavedCalls, getLifecycleStageLabel } from "@/data/sampleData";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, FileText } from "lucide-react";

const Dashboard = () => {
  const saved = getSavedCalls();
  const goDecisions = saved.filter(o => o.assessment?.judgment === 'go');
  const blocked = saved.filter(o => o.blockers.length > 0);
  const needsDocs = saved.filter(o => o.docsStatus !== 'docs_ready' && o.lifecycle !== 'discovered');
  const submitted = saved.filter(o => o.lifecycle === 'submitted');
  const newCalls = opportunities.filter(o => o.lifecycle === 'discovered');

  const topPriority = saved
    .filter(o => o.priority === 'high' && o.lifecycle !== 'submitted')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const nearDeadlines = saved
    .filter(o => o.lifecycle !== 'submitted' && o.lifecycle !== 'archived')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const nextActions = saved
    .filter(o => o.actionPlan.some(a => a.status !== 'done') && o.lifecycle !== 'submitted')
    .sort((a, b) => {
      const prio = { high: 0, medium: 1, low: 2 };
      return prio[a.priority] - prio[b.priority];
    })
    .slice(0, 5);

  const recentEvents = agentEvents.slice(0, 4);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Funding Operations</p>
          <h1 className="ink-page-title">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-muted-foreground">Live · Synced 2 min ago</span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8">
        <MetricCard label="Saved Calls" value={saved.length} sub={`${newCalls.length} newly discovered`} />
        <MetricCard label="Go Decisions" value={goDecisions.length} sub={`${submitted.length} submitted`} />
        <MetricCard label="Blocked" value={blocked.length} accent={blocked.length > 0} sub={blocked.length > 0 ? `${blocked.reduce((s, o) => s + o.blockers.length, 0)} total blockers` : 'All clear'} />
        <MetricCard label="Docs Missing" value={needsDocs.length} sub={needsDocs.length > 0 ? 'Assessment blocked' : 'All docs ready'} />
        <MetricCard label="High Priority" value={topPriority.length} sub="need action" />
      </div>

      {/* Blocked calls alert */}
      {blocked.length > 0 && (
        <div className="border border-destructive/20 rounded-sm p-4">
          <p className="text-[10px] text-destructive tracking-[0.12em] uppercase font-semibold mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Blocked Calls
          </p>
          {blocked.map(opp => (
            <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center justify-between py-2 group">
              <div>
                <p className="text-[13px] text-foreground group-hover:text-primary transition-colors font-semibold">{opp.callName}</p>
                <p className="text-[11px] text-muted-foreground">{opp.blockers[0]}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-[12px] font-bold text-destructive" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {Math.max(0, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000))}d
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="ink-rule" />

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-10">
          {/* Recommended Next Actions */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Recommended Next Actions</h2>
              <Link to="/pipeline" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Pipeline <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {nextActions.map(opp => {
              const nextAction = opp.actionPlan.find(a => a.status !== 'done');
              if (!nextAction) return null;
              return (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3.5 border-b border-border/60 last:border-0 group">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{opp.callName}</p>
                      <p className="text-[11px] text-foreground/60 mt-1 flex items-center gap-1">
                        <ArrowRight className="h-2.5 w-2.5 text-primary" />
                        {nextAction.action}
                        {nextAction.owner && <span className="text-muted-foreground ml-1">· {nextAction.owner}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <StatusChip status={opp.lifecycle} />
                      <UrgencyIndicator urgency={opp.urgency} />
                    </div>
                  </div>
                </Link>
              );
            })}
            {nextActions.length === 0 && (
              <p className="py-12 text-center text-[13px] text-muted-foreground">No pending actions</p>
            )}
          </section>

          {/* Top Priority Calls */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Top Priorities</h2>
              <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {topPriority.slice(0, 4).map((opp, i) => (
              <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center justify-between py-3 border-b border-border/60 last:border-0 group">
                <div className="min-w-0 flex-1 flex items-center gap-4">
                  <span className="text-[11px] font-bold text-muted-foreground/40 w-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{opp.callName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{opp.programme} · {opp.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
                  <ScoreBadge score={opp.fitScore} />
                  {opp.assessment && <StatusChip status={opp.assessment.judgment} dot />}
                </div>
              </Link>
            ))}
          </section>
        </div>

        <div className="lg:col-span-2 space-y-10">
          {/* Deadlines */}
          <section>
            <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Nearest Deadlines</h2>
            {nearDeadlines.map(opp => {
              const daysLeft = Math.max(0, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000));
              return (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3 border-b border-border/60 last:border-0 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate">{opp.callName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{getLifecycleStageLabel(opp.lifecycle)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-[13px] font-bold ${daysLeft <= 7 ? 'text-destructive' : daysLeft <= 21 ? 'text-warning' : 'text-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {daysLeft}d
                      </p>
                      <p className="text-[10px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* Docs Missing */}
          {needsDocs.length > 0 && (
            <section>
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-warning mb-5 flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Documents Needed
              </h2>
              {needsDocs.map(opp => (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3 border-b border-border/60 last:border-0 group">
                  <p className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate">{opp.callName}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {opp.docsStatus === 'not_downloaded' ? 'Not downloaded' : 'Pending parsing'} · Assessment blocked
                  </p>
                </Link>
              ))}
            </section>
          )}

          {/* Agent Signals */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Agent Activity</h2>
              <Link to="/agent-activity" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">All</Link>
            </div>
            {recentEvents.map(event => (
              <div key={event.id} className="ink-signal py-3 mb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.agent}</span>
                  <StatusChip status={event.severity} />
                  <span className="text-[10px] text-muted-foreground ml-auto">{event.timestamp}</span>
                </div>
                <p className="text-[12px] text-foreground/80 leading-relaxed">{event.detail}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
