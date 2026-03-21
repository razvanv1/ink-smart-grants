import { agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";

const agentSummaries = [
  { agent: 'Scout', signal: '3 new calls detected from 12 sources', severity: 'info' },
  { agent: 'Selection', signal: 'Capacity for 2 additional workflows', severity: 'warning' },
  { agent: 'Writer', signal: '89% content overlap found for Erasmus+ call', severity: 'success' },
  { agent: 'Compliance', signal: '2 annexes missing on DIGITAL-2026', severity: 'alert' },
  { agent: 'Coordinator', signal: 'Partner budget inputs 3 days overdue', severity: 'alert' },
  { agent: 'Copilot', signal: '2 active workflows, 1 at risk', severity: 'warning' },
];

const AgentActivity = () => {
  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8">
      <h1 className="text-lg font-semibold tracking-tight">Agent Activity</h1>

      {/* Summary grid — compact, no heavy panels */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 border-b border-border pb-6">
        {agentSummaries.map(s => (
          <div key={s.agent}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12px] font-semibold text-foreground">{s.agent}</span>
              <StatusChip status={s.severity} />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{s.signal}</p>
          </div>
        ))}
      </div>

      {/* Timeline — clean list */}
      <div>
        <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wide mb-4">Timeline</h2>
        <div className="divide-y divide-border">
          {agentEvents.map(event => (
            <div key={event.id} className="py-3.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-semibold text-foreground">{event.agent}</span>
                <span className="text-[11px] text-muted-foreground">· {event.action}</span>
                <span className="text-[11px] text-muted-foreground ml-auto">{event.timestamp}</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{event.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentActivity;
