import { useParams, Link } from "react-router-dom";
import { workflows, tasks as allTasks, agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, FileText, Shield, Bot, User } from "lucide-react";
import { useState } from "react";

const tabs = ['Overview', 'Draft Structure', 'Missing Inputs', 'Tasks', 'Compliance', 'Documents', 'Activity'];

const draftSections = [
  { name: 'Problem / Need', status: 'drafted', readiness: 78, source: 'KA2 Application 2024' },
  { name: 'Objectives', status: 'drafted', readiness: 85, source: 'Capability Statement' },
  { name: 'Activities & Work Packages', status: 'in-progress', readiness: 52, source: null },
  { name: 'Impact', status: 'drafted', readiness: 71, source: 'Impact Report 2024' },
  { name: 'Budget Logic', status: 'pending', readiness: 20, source: null },
  { name: 'Partnership', status: 'pending', readiness: 15, source: null },
  { name: 'Implementation Timeline', status: 'in-progress', readiness: 40, source: null },
  { name: 'Risk / Mitigation', status: 'drafted', readiness: 90, source: 'Risk Framework' },
];

const missingInputs = [
  { item: 'Partner budget breakdown from TU Berlin', owner: 'External', priority: 'high' },
  { item: 'Co-financing commitment letter', owner: 'Maria K.', priority: 'high' },
  { item: 'Updated staff CVs (WP leads)', owner: 'Nikos T.', priority: 'medium' },
  { item: 'KPI targets for digital skills outcomes', owner: 'Elena P.', priority: 'medium' },
  { item: 'Signed consortium agreement draft', owner: 'Legal', priority: 'low' },
];

const complianceChecks = [
  { check: 'Page limit (45 pages)', status: 'pass', detail: '42/45 pages used' },
  { check: 'Budget within ceiling', status: 'pass', detail: '€2.8M of €3M ceiling' },
  { check: 'Minimum consortium size', status: 'pass', detail: '5 partners confirmed' },
  { check: 'Gender action plan', status: 'warning', detail: 'Section drafted, needs review' },
  { check: 'Data management plan', status: 'missing', detail: 'Not started' },
  { check: 'Ethics self-assessment', status: 'missing', detail: 'Not started' },
  { check: 'Annex: Budget table', status: 'pass', detail: 'Uploaded' },
  { check: 'Annex: Gantt chart', status: 'warning', detail: 'Draft version only' },
];

const documents = [
  { name: 'Draft Proposal v3.docx', type: 'Proposal', date: '2026-03-18', size: '2.4 MB' },
  { name: 'Budget Annex.xlsx', type: 'Budget', date: '2026-03-15', size: '890 KB' },
  { name: 'Partner Letters of Intent.pdf', type: 'Partnership', date: '2026-03-10', size: '1.1 MB' },
  { name: 'Gantt Chart Draft.pdf', type: 'Timeline', date: '2026-03-12', size: '340 KB' },
];

const WorkflowDetail = () => {
  const { id } = useParams();
  const wf = workflows.find(w => w.id === id) || workflows[0];
  const wfTasks = allTasks.filter(t => t.workflowId === wf.id);
  const recentEvents = agentEvents.slice(0, 6);
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      <Link to="/workflows" className="text-sm text-primary hover:underline flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Workflows
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusChip status={wf.status} />
              {wf.blockers > 0 && (
                <span className="flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" /> {wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{wf.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {wf.opportunityName} · {wf.stage} · {wf.owner}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Deadline</p>
              <p className="text-sm font-semibold tabular-nums text-foreground">{wf.deadline}</p>
            </div>
            <div className="w-32">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Readiness</p>
              <ReadinessBar score={wf.readinessScore} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Current Status</h3>
            <p className="text-sm text-muted-foreground text-pretty">Proposal drafting underway. Impact and objectives sections drafted using prior KA2 application. Budget and partnership sections pending external inputs. Co-financing letter required within 5 days.</p>
            <div className="pt-2 space-y-2">
              <p className="text-xs text-muted-foreground"><strong className="text-foreground">Next milestone:</strong> Complete budget annex</p>
              <p className="text-xs text-muted-foreground"><strong className="text-foreground">Key blocker:</strong> Partner budget inputs overdue</p>
              <p className="text-xs text-muted-foreground"><strong className="text-foreground">Recommended:</strong> Follow up with TU Berlin on budget breakdown</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Sections Drafted" value="5/8" />
                <Stat label="Tasks Complete" value={`${wfTasks.filter(t=>t.status==='done').length}/${wfTasks.length}`} />
                <Stat label="Missing Inputs" value="5" />
                <Stat label="Compliance" value="5/8" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Draft Structure' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {draftSections.map((section, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{section.name}</p>
                    {section.source && <p className="text-xs text-muted-foreground">Source: {section.source}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusChip status={section.status} />
                  <div className="w-24">
                    <ReadinessBar score={section.readiness} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Missing Inputs' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {missingInputs.map((input, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${input.priority === 'high' ? 'text-destructive' : input.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm text-foreground">{input.item}</p>
                    <p className="text-xs text-muted-foreground">Owner: {input.owner}</p>
                  </div>
                </div>
                <StatusChip status={input.priority} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Tasks' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {wfTasks.length > 0 ? wfTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${task.status === 'done' ? 'text-success' : task.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.owner} · Due {task.dueDate}</p>
                  </div>
                </div>
                <StatusChip status={task.status} />
              </div>
            )) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No tasks for this workflow yet</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Compliance' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {complianceChecks.map((check, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Shield className={`h-4 w-4 shrink-0 ${check.status === 'pass' ? 'text-success' : check.status === 'warning' ? 'text-warning' : 'text-destructive'}`} />
                  <div>
                    <p className="text-sm text-foreground">{check.check}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                </div>
                <StatusChip status={check.status === 'pass' ? 'done' : check.status === 'warning' ? 'warning' : 'at-risk'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Documents' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type} · {doc.size}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{doc.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
                  {event.agent === 'Scout' || event.agent === 'Compliance' || event.agent === 'Writer' ?
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" /> :
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{event.agent}</span>
                    <span className="text-xs text-muted-foreground">{event.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

export default WorkflowDetail;
