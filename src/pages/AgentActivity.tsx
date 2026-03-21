import { agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { Radar, Scale, PenTool, Shield, Users, Sparkles, Bot } from "lucide-react";

interface AgentPanelProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  items: { label: string; detail: string; severity?: string }[];
}

function AgentPanel({ name, icon, description, items }: AgentPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-7 w-7 rounded bg-muted flex items-center justify-center shrink-0">{icon}</div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
            <p className="text-[11px] text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => (
          <div key={i} className="p-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-medium text-foreground">{item.label}</span>
              {item.severity && <StatusChip status={item.severity} />}
            </div>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const AgentActivity = () => {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Agent Activity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Multi-agent system status and recent actions</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AgentPanel
          name="Scout Agent"
          icon={<Radar className="h-4 w-4 text-muted-foreground" />}
          description="Monitors funding portals for new calls"
          items={[
            { label: '3 new calls detected', detail: 'HORIZON-WIDERA, CERV-2026, LIFE-2026 added today', severity: 'info' },
            { label: '12 sources scanned', detail: 'EU Funding Portal, national agencies, Erasmus+ portal', severity: 'success' },
            { label: 'Next scan in 4 hours', detail: 'Monitoring cycle runs every 6 hours' },
          ]}
        />
        <AgentPanel
          name="Selection Orchestrator"
          icon={<Scale className="h-4 w-4 text-muted-foreground" />}
          description="Prioritizes and recommends pursuit decisions"
          items={[
            { label: 'ERASMUS-EDU-2026 — Recommended', detail: '87% fit, moderate effort. Strong match with prior KA2 work.', severity: 'success' },
            { label: 'CERV-2026 — Needs more info', detail: '61% fit. Outside core domain. Requires new partnerships.', severity: 'warning' },
            { label: 'Capacity: 2 slots available', detail: 'Current team load supports max 2 additional active workflows', severity: 'info' },
          ]}
        />
        <AgentPanel
          name="Grant Writer Agent"
          icon={<PenTool className="h-4 w-4 text-muted-foreground" />}
          description="Drafts proposal structures and content"
          items={[
            { label: 'Impact section drafted', detail: 'DIGITAL-2026-SKILLS-04 — used 3 knowledge assets', severity: 'success' },
            { label: '89% content overlap found', detail: 'KA2 application reusable for Erasmus+ call', severity: 'info' },
            { label: 'Risk section at 90% readiness', detail: 'Adapted from validated framework template' },
          ]}
        />
        <AgentPanel
          name="Compliance Agent"
          icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          description="Validates submission requirements"
          items={[
            { label: '2 annexes missing', detail: 'Data management plan and ethics self-assessment not started', severity: 'alert' },
            { label: 'Page limit at 94%', detail: '42/45 pages used. Consider trimming activities section.', severity: 'warning' },
            { label: 'Eligibility confirmed', detail: 'HORIZON-CL4-2026 — all criteria met', severity: 'success' },
          ]}
        />
        <AgentPanel
          name="Coordinator Agent"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Manages tasks, deadlines, and partner inputs"
          items={[
            { label: 'Partner budget overdue', detail: 'TU Berlin budget inputs 3 days past deadline', severity: 'alert' },
            { label: '5-day reminder sent', detail: 'Co-financing letter due March 28', severity: 'warning' },
            { label: '3 tasks in progress', detail: 'Impact review, budget annex, partner confirmation' },
          ]}
        />
        <AgentPanel
          name="Internal Copilot"
          icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
          description="Executive summaries and strategic insights"
          items={[
            { label: 'Pipeline health: moderate', detail: '2 active workflows, 1 at risk. 3 opportunities pending review.', severity: 'warning' },
            { label: 'Top opportunity', detail: 'HORIZON-CL4-2026: 92% fit. Consortium formation needed.', severity: 'info' },
            { label: 'Execution bottleneck', detail: 'External partner inputs blocking 2 workflows' },
          ]}
        />
      </div>

      {/* Recent Timeline */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Activity Timeline</h2>
        </div>
        <div className="divide-y divide-border">
          {agentEvents.map(event => (
            <div key={event.id} className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors">
              <div className="mt-0.5 h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{event.agent}</span>
                  <span className="text-xs text-muted-foreground">{event.action}</span>
                  <StatusChip status={event.severity} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentActivity;
