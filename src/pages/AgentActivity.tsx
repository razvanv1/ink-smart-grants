import { agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { AgentAction } from "@/components/shared/AgentAction";

const agentSummaries = [
  {
    agent: 'Scout' as const,
    signal: '3 new calls from 12 sources',
    severity: 'info' as const,
    actions: [
      { label: 'Re-scan sources', variant: 'knowledge' as const },
      { label: 'Review alerts', variant: 'strategic' as const },
    ],
  },
  {
    agent: 'Selection' as const,
    signal: 'Capacity for 2 additional workflows',
    severity: 'attention' as const,
    actions: [
      { label: 'Re-run prioritization', variant: 'strategic' as const },
      { label: 'Review decisions', variant: 'strategic' as const },
    ],
  },
  {
    agent: 'Writer' as const,
    signal: '89% content overlap for Erasmus+',
    severity: 'info' as const,
    actions: [
      { label: 'Generate draft', variant: 'drafting' as const },
      { label: 'Reuse from vault', variant: 'knowledge' as const },
    ],
  },
  {
    agent: 'Compliance' as const,
    signal: '2 annexes missing on DIGITAL-2026',
    severity: 'critical' as const,
    actions: [
      { label: 'Surface missing annexes', variant: 'compliance' as const },
      { label: 'Review risk items', variant: 'compliance' as const },
    ],
  },
  {
    agent: 'Coordinator' as const,
    signal: 'Partner inputs 3 days overdue',
    severity: 'critical' as const,
    actions: [
      { label: 'Refresh partner status', variant: 'coordination' as const },
      { label: 'Prepare reminders', variant: 'coordination' as const },
    ],
  },
  {
    agent: 'Copilot' as const,
    signal: '2 active, 1 at risk',
    severity: 'attention' as const,
    actions: [
      { label: 'Summarize weak workflows', variant: 'strategic' as const },
      { label: 'Generate brief', variant: 'drafting' as const },
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8">
        {agentSummaries.map(s => (
          <div key={s.agent} className="ink-accent-border">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-foreground tracking-tight">{s.agent}</span>
              <StatusChip status={s.severity} />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-2.5">{s.signal}</p>
            <div className="flex gap-3">
              {s.actions.map(a => (
                <AgentAction key={a.label} label={a.label} variant={a.variant} compact />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ink-rule" />

      <div>
        <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Timeline</h2>
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
