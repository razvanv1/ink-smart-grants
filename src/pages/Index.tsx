import { MetricCard } from "@/components/shared/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, ReadinessBar, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { opportunities, workflows, agentEvents, tasks } from "@/data/sampleData";
import { Link } from "react-router-dom";
import {
  Radar, GitBranch, AlertTriangle, CalendarClock, CheckCircle2,
  ArrowRight, Bot, Clock, Target, TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const shortlisted = opportunities.filter(o => o.status === 'shortlisted' || o.status === 'new');
  const activeWorkflows = workflows.filter(w => w.status === 'active' || w.status === 'at-risk');
  const atRisk = workflows.filter(w => w.status === 'at-risk');
  const tasksDueThisWeek = tasks.filter(t => t.status !== 'done');
  const recentEvents = agentEvents.slice(0, 5);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Funding operations overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Last synced 2 min ago
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3" style={{ animationDelay: '0.05s' }}>
        <MetricCard label="Calls Monitored" value={47} change="+6 this week" changeType="positive" icon={<Radar className="h-4 w-4" />} />
        <MetricCard label="Matched" value={8} change="+2 new" changeType="positive" icon={<Target className="h-4 w-4" />} />
        <MetricCard label="Shortlisted" value={3} icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard label="Active Workflows" value={activeWorkflows.length} icon={<GitBranch className="h-4 w-4" />} />
        <MetricCard label="At Risk" value={atRisk.length} changeType="negative" icon={<AlertTriangle className="h-4 w-4" />} />
        <MetricCard label="Tasks Due" value={tasksDueThisWeek.length} icon={<CalendarClock className="h-4 w-4" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Priority Opportunities */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Priority Opportunities</h2>
            <Link to="/opportunities" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {shortlisted.slice(0, 4).map(opp => (
              <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{opp.callName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opp.programme} · {opp.thematicArea}</p>
                </div>
                <ScoreBadge score={opp.fitScore} label="fit" />
                <UrgencyIndicator urgency={opp.urgency} />
                <StatusChip status={opp.status} />
                <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">{opp.deadline}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Workflows Needing Attention */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Workflows</h2>
            <Link to="/workflows" className="text-xs text-primary hover:underline flex items-center gap-1">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activeWorkflows.map(wf => (
              <Link key={wf.id} to={`/workflows/${wf.id}`} className="block p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate">{wf.name}</p>
                  <StatusChip status={wf.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{wf.stage} · {wf.owner}</span>
                  <span className="tabular-nums">{wf.deadline}</span>
                </div>
                <ReadinessBar score={wf.readinessScore} />
                {wf.blockers > 0 && (
                  <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h2>
          </div>
          <div className="divide-y divide-border">
            {tasks.filter(t => t.status !== 'done').slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${task.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.owner}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={task.status} />
                  <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">{task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Agent Activity */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Agent Activity</h2>
            <Link to="/agent-activity" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{event.agent}</span>
                    <span className="text-xs text-muted-foreground">· {event.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 text-pretty">{event.detail}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
