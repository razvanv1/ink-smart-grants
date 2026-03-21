import { agentEvents, workflows, opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { AgentAction } from "@/components/shared/AgentAction";

const atRiskCount = workflows.filter(w => w.status === 'at-risk').length;
const newOpps = opportunities.filter(o => o.status === 'new').length;
const blockedTasks = workflows.reduce((s, w) => s + w.blockers, 0);

const agentSummaries = [
  {
    agent: 'Scout',
    role: 'Discovers relevant funding calls',
    signal: `${newOpps} new calls matched from 12 monitored sources`,
    severity: 'info' as const,
    actions: [
      { label: 'Review new matches', variant: 'strategic' as const, primary: true },
    ],
  },
  {
    agent: 'Selection',
    role: 'Prioritizes what to pursue',
    signal: `Capacity for ${Math.max(0, 4 - workflows.filter(w => w.status === 'active' || w.status === 'at-risk').length)} additional workflows`,
    severity: 'attention' as const,
    actions: [
      { label: 'Re-run prioritization', variant: 'strategic' as const, primary: true },
    ],
  },
  {
    agent: 'Writer',
    role: 'Drafts proposal structures',
    signal: '89% content overlap detected for Erasmus+ call',
    severity: 'info' as const,
    actions: [
      { label: 'Build draft from overlap', variant: 'drafting' as const, primary: true },
    ],
  },
  {
    agent: 'Compliance',
    role: 'Checks submission readiness',
    signal: `${blockedTasks > 0 ? `${blockedTasks} unresolved issues across workflows` : 'All checks passing'}`,
    severity: blockedTasks > 0 ? 'critical' as const : 'info' as const,
    actions: [
      { label: 'Surface compliance gaps', variant: 'compliance' as const, primary: true },
    ],
  },
  {
    agent: 'Coordinator',
    role: 'Manages inputs and partners',
    signal: 'Partner inputs 3 days overdue on DIGITAL-2026',
    severity: 'critical' as const,
    actions: [
      { label: 'Prepare follow-up', variant: 'coordination' as const, primary: true },
    ],
  },
  {
    agent: 'Copilot',
    role: 'Executive oversight layer',
    signal: `${atRiskCount} at risk · ${workflows.filter(w => w.status === 'active').length} on track`,
    severity: atRiskCount > 0 ? 'attention' as const : 'info' as const,
    actions: [
      { label: 'Summarize portfolio status', variant: 'strategic' as const, primary: true },
    ],
  },
];

const AgentActivity = () => {
  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">System Intelligence</p>
          <h1 className="ink-page-title">Agent Activity</h1>
        </div>
        <span className="text-[11px] text-muted-foreground pb-1">6 agents active</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8">
        {agentSummaries.map(s => (
          <div key={s.agent} className="ink-accent-border">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12px] font-bold text-foreground tracking-tight">{s.agent}</span>
              <StatusChip status={s.severity} />
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase mb-2">{s.role}</p>
            <p className="text-[12px] text-foreground/80 leading-relaxed mb-3">{s.signal}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.actions.map(a => (
                <AgentAction key={a.label} label={a.label} variant={a.variant} primary={a.primary} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ink-rule" />

      <div>
        <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Recent Activity</h2>
        {agentEvents.length > 0 ? agentEvents.map(event => (
          <div key={event.id} className="ink-signal py-3.5 mb-1.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.agent}</span>
              <span className="text-[10px] text-muted-foreground">· {event.eventType}</span>
              <StatusChip status={event.severity} className="ml-1" />
              <span className="text-[10px] text-muted-foreground ml-auto">{event.timestamp}</span>
            </div>
            <p className="text-[12px] text-foreground/75 leading-relaxed">{event.detail}</p>
          </div>
        )) : (
          <p className="py-16 text-center text-[13px] text-muted-foreground">No agent activity yet</p>
        )}
      </div>
    </div>
  );
};

export default AgentActivity;
