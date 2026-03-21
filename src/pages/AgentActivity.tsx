import { agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";

const agentSummaries = [
  { agent: 'Scout', signal: '3 new calls from 12 sources', severity: 'info' as const },
  { agent: 'Selection', signal: 'Capacity for 2 additional workflows', severity: 'warning' as const },
  { agent: 'Writer', signal: '89% content overlap for Erasmus+', severity: 'success' as const },
  { agent: 'Compliance', signal: '2 annexes missing on DIGITAL-2026', severity: 'alert' as const },
  { agent: 'Coordinator', signal: 'Partner inputs 3 days overdue', severity: 'alert' as const },
  { agent: 'Copilot', signal: '2 active, 1 at risk', severity: 'warning' as const },
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

      {/* Agent summary — compact grid with accent borders */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
        {agentSummaries.map(s => (
          <div key={s.agent} className="ink-accent-border">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-foreground tracking-tight">{s.agent}</span>
              <StatusChip status={s.severity} />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{s.signal}</p>
          </div>
        ))}
      </div>

      <div className="ink-rule" />

      {/* Timeline */}
      <div>
        <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Timeline</h2>
        {agentEvents.map(event => (
          <div key={event.id} className="ink-signal py-3.5 mb-1.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.agent}</span>
              <span className="text-[10px] text-muted-foreground">· {event.action}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{event.timestamp}</span>
            </div>
            <p className="text-[12px] text-foreground/75 leading-relaxed">{event.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentActivity;
