import { useParams, Link } from "react-router-dom";
import { workflows, tasks as allTasks, agentEvents, workflowStages, opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionPanel, AgentActionRow } from "@/components/shared/AgentAction";
import { ArrowLeft, AlertTriangle, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tabs = ['Overview', 'Draft', 'Inputs', 'Tasks', 'Compliance', 'Docs', 'Activity'];

const defaultDraftSections = [
  { name: 'Problem / Need', status: 'drafted', readiness: 78, source: 'KA2 Application 2024' },
  { name: 'Objectives', status: 'drafted', readiness: 85, source: 'Capability Statement' },
  { name: 'Activities & Work Packages', status: 'in-progress', readiness: 52 },
  { name: 'Impact', status: 'drafted', readiness: 71, source: 'Impact Report 2024' },
  { name: 'Budget Logic', status: 'todo', readiness: 20 },
  { name: 'Partnership', status: 'todo', readiness: 15 },
  { name: 'Implementation Timeline', status: 'in-progress', readiness: 40 },
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
  { check: 'Page limit', result: '42 / 45', status: 'pass' },
  { check: 'Budget ceiling', result: '€2.8M / €3M', status: 'pass' },
  { check: 'Consortium size', result: '5 partners', status: 'pass' },
  { check: 'Gender action plan', result: 'Needs review', status: 'warning' },
  { check: 'Data management plan', result: 'Not started', status: 'missing' },
  { check: 'Ethics self-assessment', result: 'Not started', status: 'missing' },
];

const documents = [
  { name: 'Draft Proposal v3.docx', meta: 'Proposal · 2.4 MB', date: '2026-03-18', uploadedBy: 'Maria K.' },
  { name: 'Budget Annex.xlsx', meta: 'Budget · 890 KB', date: '2026-03-15', uploadedBy: 'Maria K.' },
  { name: 'Partner Letters of Intent.pdf', meta: 'Partnership · 1.1 MB', date: '2026-03-10', uploadedBy: 'Elena P.' },
];

interface GeneratedSection {
  name: string;
  status: string;
  readiness: number;
  guidance: string;
  suggestedLength: number;
  keyPoints: string[];
  reusableFrom?: string;
}

const WorkflowDetail = () => {
  const { id } = useParams();
  const wf = workflows.find(w => w.id === id) || workflows[0];
  const opp = opportunities.find(o => o.id === wf.opportunityId);
  const wfTasks = allTasks.filter(t => t.workflowId === wf.id);
  const wfEvents = agentEvents.filter(e => e.workflowId === wf.id);
  const stageIndex = workflowStages.indexOf(wf.stage);
  const [activeTab, setActiveTab] = useState('Overview');
  const [draftSections] = useState(defaultDraftSections);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<GeneratedSection[] | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const todoSections = draftSections.filter(s => s.status === 'todo').length;
  const missingCount = missingInputs.filter(i => i.priority === 'high').length;
  const failedChecks = complianceChecks.filter(c => c.status !== 'pass').length;

  const handleBuildFirstDraft = async () => {
    if (!opp) {
      toast.error('No linked opportunity found');
      return;
    }

    setIsGenerating(true);
    toast.info('Grant Writer Agent generating proposal structure…');

    try {
      const { data, error } = await supabase.functions.invoke('generate-draft', {
        body: {
          opportunity: {
            callName: opp.callName,
            programme: opp.programme,
            thematicArea: opp.thematicArea,
            fundingType: opp.fundingType,
            fundingRange: opp.fundingRange,
            geography: opp.geography,
            summary: opp.summary,
            whyItFits: opp.whyItFits,
            partnerRequired: opp.partnerRequired,
            complexity: opp.complexity,
          },
          workflow: {
            name: wf.name,
            stage: wf.stage,
            deadline: wf.deadline,
          },
          existingSections: draftSections,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setGeneratedSections(data.sections);
      setActiveTab('Draft');
      toast.success(`Generated ${data.sections.length} proposal sections`);
    } catch (err: any) {
      console.error('Draft generation failed:', err);
      toast.error(err.message || 'Failed to generate draft structure');
    } finally {
      setIsGenerating(false);
    }
  };

  const dismissGenerated = () => {
    setGeneratedSections(null);
    setExpandedSection(null);
  };

  return (
    <div className="p-8 max-w-[1060px] mx-auto space-y-8">
      <Link to="/workflows" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Workflows
      </Link>

      <div className="border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-3">
          <StatusChip status={wf.status} dot />
          {wf.blockers > 0 && (
            <span className="text-[10px] text-destructive font-bold flex items-center gap-1 uppercase tracking-wider">
              <AlertTriangle className="h-3 w-3" />{wf.blockers} blocker{wf.blockers > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <h1 className="ink-page-title mb-2">{wf.name}</h1>
        <p className="text-[13px] text-muted-foreground">{wf.opportunityName} · {wf.owner}</p>

        <div className="flex items-center gap-8 mt-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-[3px]">
              {workflowStages.map((stage, i) => (
                <div
                  key={i}
                  className={`h-4 w-[7px] rounded-[1px] transition-colors ${i <= stageIndex ? 'bg-foreground' : 'bg-border'}`}
                  title={stage}
                />
              ))}
            </div>
            <span className="text-[12px] font-semibold text-foreground">{wf.stage}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">Readiness</span>
            <ReadinessBar score={wf.readinessScore} segments={12} />
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">Deadline</p>
            <p className="text-[14px] font-bold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{wf.deadline}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-0 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="ink-rule" />

      <div>
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-5 gap-10">
              <div className="md:col-span-3 space-y-6">
                <p className="text-[14px] text-foreground/75 leading-[1.75] text-pretty">
                  Proposal drafting underway. Impact and objectives drafted from prior KA2 application. Budget and partnership sections pending external inputs. Co-financing letter required within 5 days.
                </p>
                <div className="space-y-3">
                  <Signal label="Next" value={wf.nextMilestone} />
                  <Signal label="Blocker" value="Partner budget inputs overdue" highlight />
                  <Signal label="Recommended" value="Follow up with TU Berlin" />
                </div>
              </div>
              <div className="md:col-span-2 border-l border-border pl-8">
                <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                  <Stat label="Sections" value="5/8" />
                  <Stat label="Tasks" value={`${wfTasks.filter(t => t.status === 'done').length}/${wfTasks.length}`} />
                  <Stat label="Missing" value={String(missingInputs.length)} />
                  <Stat label="Compliance" value={`${complianceChecks.filter(c => c.status === 'pass').length}/${complianceChecks.length}`} />
                </div>
              </div>
            </div>

            <AgentActionPanel
              context={`${todoSections} sections not started · ${missingCount} high-priority inputs missing · ${failedChecks} compliance gaps`}
              actions={[
                { label: isGenerating ? 'Generating…' : 'Build first draft', variant: 'drafting', primary: todoSections > 0, onClick: handleBuildFirstDraft, disabled: isGenerating },
                { label: 'Surface missing inputs', variant: 'coordination', primary: missingCount > 0 },
                { label: 'Review readiness', variant: 'compliance', primary: true },
                { label: 'Detect blockers', variant: 'compliance' },
                { label: 'Prepare partner request', variant: 'coordination' },
              ]}
            />
          </div>
        )}

        {activeTab === 'Draft' && (
          <div>
            <AgentActionRow
              actions={[
                { label: isGenerating ? 'Generating…' : 'Build missing sections', variant: 'drafting', onClick: handleBuildFirstDraft, disabled: isGenerating },
                { label: 'Reuse past proposal content', variant: 'knowledge' },
              ]}
              className="mb-5"
            />

            {isGenerating && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-[13px] text-muted-foreground">Grant Writer Agent analyzing opportunity and generating structure…</span>
              </div>
            )}

            {generatedSections && !isGenerating && (
              <div className="mb-8 border border-primary/20 rounded-sm bg-primary/[0.02]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-bold tracking-wide uppercase text-primary">AI-generated structure</span>
                    <span className="text-[11px] text-muted-foreground">· {generatedSections.length} sections</span>
                  </div>
                  <button onClick={dismissGenerated} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {generatedSections.map((s, i) => (
                  <div key={i} className="border-b border-border/30 last:border-b-0">
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/[0.02] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground/40 font-bold w-5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{s.name}</p>
                          {s.reusableFrom && (
                            <p className="text-[11px] text-success mt-0.5">Reusable from: {s.reusableFrom}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] text-muted-foreground">{s.suggestedLength} words</span>
                        <StatusChip status={s.status} />
                        <ReadinessBar score={s.readiness} segments={8} />
                      </div>
                    </button>
                    {expandedSection === i && (
                      <div className="px-4 pb-4 pl-12 space-y-3">
                        <p className="text-[13px] text-foreground/75 leading-relaxed">{s.guidance}</p>
                        <div>
                          <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold mb-1.5">Key points</p>
                          <ul className="space-y-1">
                            {s.keyPoints.map((point, pi) => (
                              <li key={pi} className="text-[12px] text-foreground/70 flex items-start gap-2">
                                <span className="text-muted-foreground/40 mt-0.5">–</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {draftSections.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground/40 font-bold w-5" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{s.name}</p>
                    {s.source && <p className="text-[11px] text-muted-foreground mt-0.5">via {s.source}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <StatusChip status={s.status} />
                  <ReadinessBar score={s.readiness} segments={8} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Inputs' && (
          <div>
            <AgentActionRow
              actions={[
                { label: 'Prepare collection email', variant: 'coordination' },
                { label: 'Flag overdue items', variant: 'compliance' },
              ]}
              className="mb-5"
            />
            {missingInputs.map((input, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <p className="text-[13px] text-foreground">{input.item}</p>
                <StatusChip status={input.priority} />
              </div>
            ))}
            {missingInputs.length === 0 && (
              <p className="py-16 text-center text-[13px] text-muted-foreground">All inputs received</p>
            )}
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div>
            <AgentActionRow
              actions={[
                { label: 'Generate task list from call', variant: 'coordination' },
                { label: 'Detect dependencies', variant: 'compliance' },
              ]}
              className="mb-5"
            />
            {wfTasks.length > 0 ? wfTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <div>
                  <p className="text-[13px] text-foreground">{task.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {task.owner} · {task.dueDate}
                    {task.dependency && <span className="text-warning"> · Depends on: {task.dependency}</span>}
                  </p>
                </div>
                <StatusChip status={task.status} dot />
              </div>
            )) : (
              <p className="py-16 text-center text-[13px] text-muted-foreground">No tasks yet</p>
            )}
          </div>
        )}

        {activeTab === 'Compliance' && (
          <div>
            <AgentActionRow
              actions={[
                { label: 'Check compliance gaps', variant: 'compliance' },
                { label: 'Surface missing annexes', variant: 'compliance' },
              ]}
              className="mb-5"
            />
            {complianceChecks.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${c.status === 'pass' ? 'bg-success' : c.status === 'warning' ? 'bg-warning' : 'bg-destructive'}`} />
                  <div>
                    <p className="text-[13px] text-foreground">{c.check}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{c.result}</p>
                  </div>
                </div>
                <StatusChip status={c.status === 'pass' ? 'done' : c.status === 'warning' ? 'attention' : 'risk'} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Docs' && (
          <div>
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/40 cursor-pointer hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{doc.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{doc.meta} · {doc.uploadedBy}</p>
                </div>
                <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{doc.date}</span>
              </div>
            ))}
            <button className="mt-4 text-[11px] text-primary font-semibold tracking-wide uppercase hover:underline">
              Upload Document
            </button>
          </div>
        )}

        {activeTab === 'Activity' && (
          <div>
            {wfEvents.length > 0 ? wfEvents.map(event => (
              <div key={event.id} className="ink-signal py-3.5 mb-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.agent}</span>
                  <span className="text-[10px] text-muted-foreground">· {event.eventType}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{event.timestamp}</span>
                </div>
                <p className="text-[12px] text-foreground/75 leading-relaxed">{event.detail}</p>
              </div>
            )) : (
              <p className="py-16 text-center text-[13px] text-muted-foreground">No activity yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function Signal({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase w-28 shrink-0 font-semibold">{label}</span>
      <span className={`text-[13px] ${highlight ? 'text-destructive font-semibold' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium">{label}</p>
      <p className="text-xl font-bold text-foreground tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
    </div>
  );
}

export default WorkflowDetail;
