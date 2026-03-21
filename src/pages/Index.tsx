import { MetricCard } from "@/components/shared/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, ReadinessBar } from "@/components/shared/ScoreBadge";
import { opportunities, workflows, agentEvents, tasks } from "@/data/sampleData";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const priorityOpps = opportunities.filter(o => o.status === 'shortlisted' || o.status === 'new').slice(0, 3);
  const activeWorkflows = workflows.filter(w => w.status === 'active' || w.status === 'at-risk');
  const urgentTasks = tasks.filter(t => t.status === 'overdue' || t.status === 'in-progress').slice(0, 4);
  const recentEvents = agentEvents.slice(0, 4);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
      </div>

      {/* Metrics — flat, no cards, separated by subtle dividers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-border pb-1">
        <MetricCard label="Monitored" value={47} sub="+6 this week" />
        <MetricCard label="Matched" value={8} sub="2 new" />
        <MetricCard label="Active Workflows" value={activeWorkflows.length} />
        <MetricCard label="At Risk" value={workflows.filter(w => w.status === 'at-risk').length} sub="Needs attention" />
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Left: Priority opportunities */}
        <div className="lg:col-span-3 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">Priority Opportunities</h2>
              <Link to="/opportunities" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-border">
              {priorityOpps.map(opp => (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center justify-between py-3.5 group">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{opp.callName}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{opp.programme} · {opp.deadline}</p>
                  </div>
                  <div className="flex items-center gap-5 ml-4 shrink-0">
                    <ScoreBadge score={opp.fitScore} label="fit" />
                    <StatusChip status={opp.status} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">Workflows</h2>
              <Link to="/workflows" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeWorkflows.map(wf => (
                <Link key={wf.id} to={`/workflows/${wf.id}`} className="block py-3 border-b border-border last:border-0 group">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{wf.name}</p>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <StatusChip status={wf.status} />
                      {wf.blockers > 0 && (
                        <span className="text-[11px] text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {wf.blockers}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
                    <span>{wf.stage} · {wf.owner}</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{wf.deadline}</span>
                  </div>
                  <ReadinessBar score={wf.readinessScore} />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Tasks + Agent signals */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-4">Deadlines</h2>
            <div className="space-y-0 divide-y divide-border">
              {urgentTasks.map(task => (
                <div key={task.id} className="py-3">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-foreground">{task.title}</p>
                    <StatusChip status={task.status} className="ml-3 shrink-0" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{task.owner} · {task.dueDate}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide">Agent Signals</h2>
              <Link to="/agent-activity" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-border">
              {recentEvents.map(event => (
                <div key={event.id} className="py-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-foreground">{event.agent}</span>
                    <span className="text-[11px] text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{event.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
