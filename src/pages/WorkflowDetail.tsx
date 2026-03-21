import { useParams, Link } from "react-router-dom";
import { workflows, tasks as allTasks, agentEvents } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useState } from "react";

const tabs = ['Overview', 'Draft', 'Missing Inputs', 'Tasks', 'Compliance', 'Documents', 'Activity'];

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
  { item: 'Partner budget from TU Berlin', priority: 'high' },
  { item: 'Co-financing commitment letter', priority: 'high' },
  { item: 'Updated staff CVs', priority: 'medium' },
  { item: 'KPI targets for outcomes', priority: 'medium' },
  { item: 'Consortium agreement draft', priority: 'low' },
];

const complianceChecks = [
  { check: 'Page limit (45p)', result: '42/45', status: 'pass' },
  { check: 'Budget ceiling', result: '€2.8M / €3M', status: 'pass' },
  { check: 'Consortium size', result: '5 partners', status: 'pass' },
  { check: 'Gender action plan', result: 'Needs review', status: 'warning' },
  { check: 'Data management plan', result: 'Not started', status: 'missing' },
  { check: 'Ethics self-assessment', result: 'Not started', status: 'missing' },
];

const documents = [
  { name: 'Draft Proposal v3.docx', meta: 'Proposal · 2.4 MB', date: '2026-03-18' },
  { name: 'Budget Annex.xlsx', meta: 'Budget · 890 KB', date: '2026-03-15' },
  { name: 'Partner Letters of Intent.pdf', meta: 'Partnership · 1.1 MB', date: '2026-03-10' },
  { name: 'Gantt Chart Draft.pdf', meta: 'Timeline · 340 KB', date: '2026-03-12' },
];

const WorkflowDetail = () => {
  const { id } = useParams();
  const wf = workflows.find(w => w.id === id) || workflows[0];
  const wfTasks = allTasks.filter(t => t.workflowId === wf.id);
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-6">
      <Link to="/workflows" className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Workflows
      </Link>

      {/* Header — flat, no card wrapper */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{wf.name}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{wf.stage} · {wf.owner} · {wf.deadline}</p>
          <div className="flex items-center gap-3 mt-2">
            <StatusChip status={wf.status} />
            {wf.blockers > 0 && (
              <span className="text-[11px] text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="w-40">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Readiness</p>
          <ReadinessBar score={wf.readinessScore} />
        </div>
      </div>

      {/* Tabs — underline style */}
      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-[1.5px] -mb-px transition-colors ${
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <p className="text-[14px] text-muted-foreground leading-[1.7] text-pretty mb-6">
                Proposal drafting underway. Impact and objectives drafted from prior KA2 application. Budget and partnership sections pending external inputs.
              </p>
              <div className="space-y-3 border-t border-border pt-5">
                <Signal label="Next milestone" value="Complete budget annex" />
                <Signal label="Key blocker" value="Partner budget inputs overdue" highlight />
                <Signal label="Recommended" value="Follow up with TU Berlin" />
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-y-4 gap-x-6 border-l border-border pl-8 content-start">
              <Stat label="Sections" value="5 / 8" />
              <Stat label="Tasks" value={`${wfTasks.filter(t=>t.status==='done').length} / ${wfTasks.length}`} />
              <Stat label="Missing" value="5" />
              <Stat label="Compliance" value="3 / 6" />
            </div>
          </div>
        )}

        {activeTab === 'Draft' && (
          <div className="divide-y divide-border">
            {draftSections.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{s.name}</p>
                  {s.source && <p className="text-[11px] text-muted-foreground mt-0.5">via {s.source}</p>}
                </div>
                <div className="flex items-center gap-5">
                  <StatusChip status={s.status} />
                  <div className="w-20"><ReadinessBar score={s.readiness} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Missing Inputs' && (
          <div className="divide-y divide-border">
            {missingInputs.map((input, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <p className="text-[13px] text-foreground">{input.item}</p>
                <StatusChip status={input.priority} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="divide-y divide-border">
            {wfTasks.length > 0 ? wfTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-[13px] text-foreground">{task.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{task.owner} · {task.dueDate}</p>
                </div>
                <StatusChip status={task.status} />
              </div>
            )) : (
              <p className="py-12 text-center text-sm text-muted-foreground">No tasks yet</p>
            )}
          </div>
        )}

        {activeTab === 'Compliance' && (
          <div className="divide-y divide-border">
            {complianceChecks.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-[13px] text-foreground">{c.check}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{c.result}</p>
                </div>
                <StatusChip status={c.status} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="divide-y divide-border">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-secondary/40 -mx-2 px-2 rounded transition-colors">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{doc.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{doc.meta}</p>
                </div>
                <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{doc.date}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Activity' && (
          <div className="divide-y divide-border">
            {agentEvents.slice(0, 6).map(event => (
              <div key={event.id} className="py-3.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold text-foreground">{event.agent}</span>
                  <span className="text-[11px] text-muted-foreground">{event.timestamp}</span>
                </div>
                <p className="text-[12px] text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function Signal({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide w-28 shrink-0">{label}</span>
      <span className={`text-[13px] ${highlight ? 'text-destructive font-medium' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
    </div>
  );
}

export default WorkflowDetail;
