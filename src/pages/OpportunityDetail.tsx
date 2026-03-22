import { useParams, Link } from "react-router-dom";
import { opportunities, workflows, getLifecycleStageLabel } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator, ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { ArrowLeft, ArrowRight, FileText, Download, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const tabs = ['Overview', 'Documents', 'Assessment', 'Action Plan', 'Notes'];

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find(o => o.id === id);
  const linkedWorkflow = opp ? workflows.find(w => w.opportunityId === opp.id) : null;
  const [activeTab, setActiveTab] = useState('Overview');

  if (!opp) {
    return (
      <div className="p-8 max-w-[900px] mx-auto">
        <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <p className="text-muted-foreground">Call not found.</p>
      </div>
    );
  }

  const assessment = opp.assessment;
  const hasBlockers = opp.blockers.length > 0;

  return (
    <div className="p-8 max-w-[1060px] mx-auto space-y-8">
      <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Opportunities
      </Link>

      {/* Header */}
      <div className="border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-3">
          <StatusChip status={opp.lifecycle} dot />
          {assessment && <StatusChip status={assessment.judgment} dot />}
          <UrgencyIndicator urgency={opp.urgency} />
          {hasBlockers && (
            <span className="text-[10px] text-destructive font-bold flex items-center gap-1 uppercase tracking-wider">
              <AlertTriangle className="h-3 w-3" />{opp.blockers.length} blocker{opp.blockers.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <h1 className="ink-page-title mb-2">{opp.callName}</h1>
        <p className="text-[13px] text-muted-foreground">{opp.programme} · {opp.thematicArea} · {opp.fundingRange}</p>

        <div className="flex items-center gap-8 mt-6">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Fit</p>
            <ScoreBadge score={opp.fitScore} large />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Effort</p>
            <ScoreBadge score={opp.effortScore} large />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Priority</p>
            <StatusChip status={opp.priority} className="text-[13px]" />
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">Deadline</p>
            <p className="text-[14px] font-bold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border">
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

      {/* Tab Content */}
      <div>
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3 space-y-8">
              <p className="text-[14px] text-foreground/75 leading-[1.75] text-pretty">{opp.summary}</p>

              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                <Detail label="Funding" value={opp.fundingRange} />
                <Detail label="Geography" value={opp.geography} />
                <Detail label="Partner" value={opp.partnerRequired ? 'Required' : 'Not required'} />
                <Detail label="Complexity" value={opp.complexity} />
                <Detail label="Type" value={opp.fundingType} />
                <Detail label="Eligibility" value={opp.eligibility} />
              </div>

              {/* Blockers */}
              {hasBlockers && (
                <div className="border border-destructive/20 rounded-sm p-4">
                  <p className="text-[10px] text-destructive tracking-[0.12em] uppercase font-semibold mb-2">Blockers</p>
                  {opp.blockers.map((b, i) => (
                    <p key={i} className="text-[13px] text-foreground/80 flex items-start gap-2 mb-1">
                      <AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" /> {b}
                    </p>
                  ))}
                </div>
              )}

              <AgentActionPanel
                context={`${getLifecycleStageLabel(opp.lifecycle)} · ${opp.docsStatus === 'docs_ready' ? 'Docs ready' : 'Docs missing'} · ${opp.complexity} complexity`}
                actions={[
                  ...(opp.docsStatus !== 'docs_ready' ? [{ label: 'Download official documents', variant: 'knowledge' as const, primary: true }] : []),
                  ...(opp.docsStatus === 'docs_ready' && !assessment ? [{ label: 'Run assessment', variant: 'strategic' as const, primary: true }] : []),
                  ...(opp.partnerRequired ? [{ label: 'Find matching partners', variant: 'coordination' as const }] : []),
                  { label: 'Generate decision brief', variant: 'drafting' as const },
                  { label: 'Compare similar calls', variant: 'knowledge' as const },
                ]}
              />
            </div>

            <div className="md:col-span-2 space-y-8">
              {/* Recommendation */}
              {assessment && (
                <div className="ink-accent-border">
                  <p className="text-[10px] text-primary tracking-[0.12em] uppercase font-semibold mb-2">Recommendation</p>
                  <p className="text-[13px] text-foreground leading-relaxed font-medium">{assessment.recommendation}</p>
                  {!assessment.basedOnDocs && (
                    <p className="text-[11px] text-warning mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Based on summary only — official docs not parsed
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Why It Fits</p>
                <p className="text-[13px] text-foreground leading-relaxed">{opp.whyItFits}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Constraints</p>
                <p className="text-[13px] text-foreground leading-relaxed">{opp.whyDifficult}</p>
              </div>

              {/* CTA */}
              <div className="border-t border-border pt-5">
                {linkedWorkflow ? (
                  <Link
                    to={`/workflows/${linkedWorkflow.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-[12px] font-bold tracking-wide rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
                  >
                    VIEW WORKFLOW <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : opp.lifecycle === 'rejected' ? (
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-[12px] font-bold tracking-wide rounded-sm hover:bg-secondary transition-colors active:scale-[0.97]">
                    MOVE TO WATCHLIST
                  </button>
                ) : (
                  <button
                    onClick={() => toast.info('Workflow creation coming in production')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-[12px] font-bold tracking-wide rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
                  >
                    START WORKFLOW <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">
                Official Documents · <StatusChip status={opp.docsStatus} />
              </p>
              {opp.docsStatus !== 'docs_ready' && (
                <button
                  onClick={() => toast.info('Downloading documents…')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide text-foreground border border-border rounded-sm hover:bg-secondary transition-colors active:scale-[0.97]"
                >
                  <Download className="h-3 w-3" /> DOWNLOAD ALL
                </button>
              )}
            </div>

            {opp.officialDocs.length > 0 ? opp.officialDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between py-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{doc.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {doc.type.replace(/_/g, ' ')}
                      {doc.pages && ` · ${doc.pages} pages`}
                      {doc.downloadedAt && ` · Downloaded ${doc.downloadedAt}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.parsed ? (
                    <span className="text-[11px] text-success font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Parsed</span>
                  ) : (
                    <span className="text-[11px] text-warning font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Not parsed</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-16 text-center">
                <FileText className="h-6 w-6 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-[13px] text-foreground font-semibold">No documents downloaded</p>
                <p className="text-[12px] text-muted-foreground mt-1">Download official call documents to enable accurate assessment</p>
              </div>
            )}

            {opp.docsStatus !== 'docs_ready' && opp.officialDocs.length === 0 && (
              <div className="border border-warning/20 rounded-sm p-4">
                <p className="text-[11px] text-warning font-semibold">Assessment blocked</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  No serious assessment before downloading and parsing official call documents.
                  Assessment will remain uncertain until docs are ready.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Assessment' && (
          <div className="space-y-8">
            {assessment ? (
              <>
                {!assessment.basedOnDocs && (
                  <div className="border border-warning/20 rounded-sm p-4">
                    <p className="text-[11px] text-warning font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Assessment based on public summary only
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      Official documents have not been downloaded or parsed. Assessment confidence is uncertain.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Eligibility</p>
                    <StatusChip status={assessment.eligibility} dot className="text-[13px] mb-2" />
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.eligibilityNotes}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Complexity</p>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.complexityNotes}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Fit Analysis</p>
                  <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.fitNotes}</p>
                </div>

                {assessment.risks.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Risks</p>
                    {assessment.risks.map((r, i) => (
                      <p key={i} className="text-[13px] text-foreground/80 flex items-start gap-2 mb-1.5">
                        <XCircle className="h-3 w-3 text-destructive shrink-0 mt-0.5" /> {r}
                      </p>
                    ))}
                  </div>
                )}

                <div className="ink-accent-border">
                  <p className="text-[10px] text-primary tracking-[0.12em] uppercase font-semibold mb-2">Judgment: {assessment.judgment.toUpperCase()}</p>
                  <p className="text-[14px] text-foreground font-medium leading-relaxed">{assessment.recommendation}</p>
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-[13px] text-foreground font-semibold">No assessment available</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {opp.docsStatus !== 'docs_ready'
                    ? 'Download official documents first to enable assessment'
                    : 'Run an assessment to evaluate eligibility, fit, and risks'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Action Plan' && (
          <div className="space-y-4">
            {opp.actionPlan.length > 0 ? opp.actionPlan.map(action => (
              <div key={action.id} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    action.status === 'done' ? 'bg-success' :
                    action.status === 'blocked' ? 'bg-destructive' : 'bg-muted-foreground/30'
                  }`} />
                  <div>
                    <p className="text-[13px] text-foreground">{action.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {action.owner && `${action.owner} · `}{action.dueDate || 'No deadline'}
                    </p>
                  </div>
                </div>
                <StatusChip status={action.status} />
              </div>
            )) : (
              <div className="py-16 text-center">
                <p className="text-[13px] text-foreground font-semibold">No actions planned</p>
                <p className="text-[12px] text-muted-foreground mt-1">Actions will be generated after assessment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="space-y-4">
            {opp.notes.length > 0 ? opp.notes.map((note, i) => (
              <div key={i} className="py-3 border-b border-border/40">
                <p className="text-[13px] text-foreground/80 leading-relaxed">{note}</p>
              </div>
            )) : (
              <div className="py-16 text-center">
                <p className="text-[13px] text-foreground font-semibold">No notes yet</p>
                <p className="text-[12px] text-muted-foreground mt-1">Add notes and decisions as you evaluate this call</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">{label}</p>
      <p className="text-[13px] font-medium text-foreground mt-0.5 capitalize">{value}</p>
    </div>
  );
}

export default OpportunityDetail;
