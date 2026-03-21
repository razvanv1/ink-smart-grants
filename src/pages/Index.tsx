import { MetricCard } from "@/components/shared/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, ReadinessBar, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { opportunities, workflows, agentEvents, tasks } from "@/data/sampleData";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const topOpp = opportunities.find(o => o.fitScore >= 90);
  const priorityOpps = opportunities.filter(o => o.status === 'shortlisted' || o.status === 'new').slice(0, 4);
  const activeWorkflows = workflows.filter(w => w.status === 'active' || w.status === 'at-risk');
  const atRiskCount = workflows.filter(w => w.status === 'at-risk').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const urgentTasks = tasks.filter(t => t.status === 'blocked' || t.status === 'in-progress').slice(0, 3);
  const recentEvents = agentEvents.slice(0, 4);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-12">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Funding Operations</p>
          <h1 className="ink-page-title">Overview</h1>
        </div>
        <p className="text-[11px] text-muted-foreground pb-1">Last sync 2 min ago</p>
      </div>

      {topOpp && (
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 ink-accent-border">
            <p className="text-[10px] text-primary tracking-[0.15em] uppercase font-semibold mb-2">Top Match</p>
            <Link to={`/opportunities/${topOpp.id}`} className="group">
              <h2 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{topOpp.callName}</h2>
            </Link>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed max-w-lg">{topOpp.programme} · {topOpp.thematicArea} · Deadline {topOpp.deadline}</p>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Fit</p>
                <ScoreBadge score={topOpp.fitScore} large />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Effort</p>
                <ScoreBadge score={topOpp.effortScore} large />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Urgency</p>
                <div className="mt-1.5"><UrgencyIndicator urgency={topOpp.urgency} /></div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-0">
            <MetricCard label="Monitored" value={opportunities.length} sub="+2 this week" />
            <MetricCard label="Matched" value={opportunities.filter(o => o.fitScore >= 60).length} sub={`${opportunities.filter(o => o.status === 'new').length} new`} />
            <MetricCard label="Workflows" value={activeWorkflows.length} />
            <MetricCard label="At Risk" value={atRiskCount} accent />
          </div>
        </div>
      )}

      <AgentActionPanel
        context={`${atRiskCount} workflow${atRiskCount !== 1 ? 's' : ''} at risk · ${blockedTasks} blocked task${blockedTasks !== 1 ? 's' : ''} · ${opportunities.filter(o => o.status === 'new').length} new opportunities`}
        actions={[
          { label: 'Prioritize this week', variant: 'strategic', primary: true },
          { label: 'Flag submission risks', variant: 'compliance', primary: atRiskCount > 0 },
          { label: 'Surface blockers', variant: 'coordination' },
        ]}
      />

      <div className="ink-rule" />

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Priority Opportunities</h2>
              <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {priorityOpps.length > 0 ? priorityOpps.map((opp, i) => (
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
                  <UrgencyIndicator urgency={opp.urgency} />
                </div>
              </Link>
            )) : (
              <p className="py-12 text-center text-[13px] text-muted-foreground">No priority opportunities yet</p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Active Workflows</h2>
              <Link to="/workflows" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {activeWorkflows.length > 0 ? activeWorkflows.map(wf => (
              <Link key={wf.id} to={`/workflows/${wf.id}`} className="block py-4 border-b border-border/60 last:border-0 group">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{wf.name}</p>
                    {wf.blockers > 0 && (
                      <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 shrink-0">
                        <AlertTriangle className="h-3 w-3" />{wf.blockers}
                      </span>
                    )}
                  </div>
                  <StatusChip status={wf.status} dot />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{wf.stage} · {wf.owner}</span>
                  <ReadinessBar score={wf.readinessScore} segments={8} />
                </div>
              </Link>
            )) : (
              <p className="py-12 text-center text-[13px] text-muted-foreground">No active workflows</p>
            )}
          </section>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Deadlines</h2>
            {urgentTasks.length > 0 ? urgentTasks.map(task => (
              <div key={task.id} className="py-3 border-b border-border/60 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] text-foreground">{task.title}</p>
                  <StatusChip status={task.status} dot className="shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{task.owner} · {task.dueDate}</p>
              </div>
            )) : (
              <p className="py-8 text-[13px] text-muted-foreground">No urgent deadlines</p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Signals</h2>
              <Link to="/agent-activity" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">All</Link>
            </div>
            {recentEvents.map(event => (
              <div key={event.id} className="ink-signal py-3 mb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.agent}</span>
                  <span className="text-[10px] text-muted-foreground">{event.timestamp}</span>
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
