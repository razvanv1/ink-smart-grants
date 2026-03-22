import { useParams, Link } from "react-router-dom";
import { useOpportunityDetail, useUpdateOpportunity, useAddNote, useUpdateActionItem, useDownloadDocuments } from "@/hooks/useOpportunities";
import { useRunAssessment } from "@/hooks/useRunAssessment";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { ArrowLeft, ArrowRight, FileText, Download, AlertTriangle, CheckCircle, Clock, XCircle, Loader2, ExternalLink, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const tabs = ['Overview', 'Documents', 'Assessment', 'Action Plan', 'Notes'];

type AssessmentRunStatus = 'not_started' | 'queued' | 'running' | 'completed' | 'failed';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { data: opp, isLoading, error } = useOpportunityDetail(id);
  const updateOpp = useUpdateOpportunity();
  const addNote = useAddNote();
  const updateAction = useUpdateActionItem();
  const downloadDocs = useDownloadDocuments();
  const runAssessment = useRunAssessment();
  const [activeTab, setActiveTab] = useState('Overview');
  const [newNote, setNewNote] = useState('');

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1060px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="p-8 max-w-[900px] mx-auto">
        <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <p className="text-muted-foreground">{error ? `Error: ${(error as Error).message}` : 'Call not found.'}</p>
      </div>
    );
  }

  const assessment = opp.assessment;
  const hasBlockers = (opp.blockers?.length ?? 0) > 0;
  const runStatus = ((opp as any).assessment_run_status ?? 'not_started') as AssessmentRunStatus;
  const runError = (opp as any).assessment_run_error as string | null;
  const docsReady = opp.docs_status === 'docs_ready';
  const isRunning = runAssessment.isPending || runStatus === 'running' || runStatus === 'queued';

  const handlePriorityChange = (priority: 'high' | 'medium' | 'low') => {
    updateOpp.mutate(
      { id: opp.id, updates: { priority } },
      { onSuccess: () => toast.success(`Priority set to ${priority}`) }
    );
  };

  const handleDownloadDocs = () => {
    downloadDocs.mutate(
      { opportunityId: opp.id },
      {
        onSuccess: (res) => toast.success(res.message || 'Document ingestion started'),
        onError: (err) => toast.error((err as Error).message || 'Failed to ingest documents'),
      }
    );
  };

  const handleRunAssessment = () => {
    runAssessment.mutate(
      { opportunityId: opp.id },
      {
        onSuccess: (res) => {
          if (res.status === 'completed') {
            toast.success(`Assessment complete — Judgment: ${res.judgment?.toUpperCase() ?? 'Done'}`);
          }
        },
        onError: (err) => toast.error((err as Error).message || 'Assessment failed'),
      }
    );
  };

  const handleSubmitNote = () => {
    if (!newNote.trim()) return;
    addNote.mutate(
      { opportunityId: opp.id, content: newNote.trim() },
      { onSuccess: () => { setNewNote(''); toast.success('Note added'); } }
    );
  };

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
          {/* Assessment run status badge */}
          {runStatus === 'running' && (
            <span className="text-[10px] text-info font-bold flex items-center gap-1 uppercase tracking-wider">
              <Loader2 className="h-3 w-3 animate-spin" /> Assessing…
            </span>
          )}
          {runStatus === 'failed' && (
            <span className="text-[10px] text-destructive font-bold flex items-center gap-1 uppercase tracking-wider">
              <XCircle className="h-3 w-3" /> Assessment failed
            </span>
          )}
        </div>
        <h1 className="ink-page-title mb-2">{opp.call_name}</h1>
        <p className="text-[13px] text-muted-foreground">{opp.programme} · {opp.thematic_area} · {opp.funding_range}</p>

        <div className="flex items-center gap-8 mt-6">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Fit</p>
            <ScoreBadge score={opp.fit_score} large />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Effort</p>
            <ScoreBadge score={opp.effort_score} large />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-1">Priority</p>
            <div className="flex items-center gap-1">
              {(['high', 'medium', 'low'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors ${
                    opp.priority === p ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">Deadline</p>
            <p className="text-[14px] font-bold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline || '—'}</p>
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
                <Detail label="Funding" value={opp.funding_range} />
                <Detail label="Geography" value={opp.geography} />
                <Detail label="Partner" value={opp.partner_required ? 'Required' : 'Not required'} />
                <Detail label="Complexity" value={opp.complexity} />
                <Detail label="Type" value={opp.funding_type} />
                <Detail label="Eligibility" value={opp.eligibility_text} />
              </div>

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
            </div>

            <div className="md:col-span-2 space-y-8">
              {assessment && (
                <div className="ink-accent-border">
                  <p className="text-[10px] text-primary tracking-[0.12em] uppercase font-semibold mb-2">Recommendation</p>
                  <p className="text-[13px] text-foreground leading-relaxed font-medium">{assessment.recommendation}</p>
                  {!assessment.based_on_docs && (
                    <p className="text-[11px] text-warning mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Based on summary only — official docs not parsed
                    </p>
                  )}
                </div>
              )}

              {opp.why_it_fits && (
                <div>
                  <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Why It Fits</p>
                  <p className="text-[13px] text-foreground leading-relaxed">{opp.why_it_fits}</p>
                </div>
              )}
              {opp.why_difficult && (
                <div>
                  <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Constraints</p>
                  <p className="text-[13px] text-foreground leading-relaxed">{opp.why_difficult}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">
                Official Documents · <StatusChip status={opp.docs_status} />
              </p>
              <button
                onClick={handleDownloadDocs}
                disabled={downloadDocs.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide text-foreground border border-border rounded-sm hover:bg-secondary transition-colors active:scale-[0.97] disabled:opacity-50"
              >
                {downloadDocs.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                {opp.documents.length > 0 ? 'RE-DOWNLOAD' : 'DOWNLOAD'}
              </button>
            </div>

            {opp.documents.length > 0 ? opp.documents.map(doc => {
              const hasError = !!doc.download_error;
              const isStored = !!doc.storage_path;
              const sizeLabel = doc.file_size ? formatFileSize(doc.file_size) : null;

              return (
                <div key={doc.id} className={`py-3 border-b gap-3 ${hasError ? 'border-destructive/20' : 'border-border/40'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={`h-4 w-4 shrink-0 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground truncate">{doc.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {doc.doc_type.replace(/_/g, ' ')}
                          {doc.content_type && ` · ${doc.content_type.split('/').pop()}`}
                          {sizeLabel && ` · ${sizeLabel}`}
                          {doc.pages && ` · ${doc.pages} pages`}
                          {doc.downloaded_at && ` · ${new Date(doc.downloaded_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          Source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {isStored ? (
                        <span className="text-[11px] text-success font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Stored</span>
                      ) : hasError ? (
                        <span className="text-[11px] text-destructive font-semibold flex items-center gap-1"><XCircle className="h-3 w-3" /> Failed</span>
                      ) : (
                        <span className="text-[11px] text-warning font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>
                      )}
                      {doc.parsed ? (
                        <span className="text-[11px] text-success font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Parsed</span>
                      ) : isStored ? (
                        <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Not parsed</span>
                      ) : null}
                    </div>
                  </div>
                  {hasError && (
                    <div className="mt-2 ml-7 flex items-center gap-2">
                      <p className="text-[11px] text-destructive font-mono truncate flex-1">{doc.download_error}</p>
                      <button
                        onClick={handleDownloadDocs}
                        disabled={downloadDocs.isPending}
                        className="text-[11px] font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 shrink-0"
                      >
                        <RotateCcw className="h-3 w-3" /> Retry
                      </button>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="py-16 text-center">
                <FileText className="h-6 w-6 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-[13px] text-foreground font-semibold">No documents downloaded</p>
                <p className="text-[12px] text-muted-foreground mt-1">Download official call documents to enable accurate assessment</p>
              </div>
            )}

            {opp.docs_status !== 'docs_ready' && opp.documents.length === 0 && (
              <div className="border border-warning/20 rounded-sm p-4">
                <p className="text-[11px] text-warning font-semibold">Assessment blocked</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  No serious assessment before downloading and parsing official call documents.
                </p>
              </div>
            )}

            {!isStored(opp.documents) && opp.documents.length > 0 && (
              <div className="border border-muted rounded-sm p-4">
                <p className="text-[11px] text-muted-foreground">
                  <strong>Parsing not implemented yet.</strong> Document text extraction will be handled by the OpenClaw backend when connected.
                </p>
              </div>
            )}
          </div>
        )}
          <div className="space-y-8">
            {/* Run Assessment controls */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">
                  Assessment
                  {runStatus === 'completed' && assessment && (
                    <span className="ml-2 text-success">· Complete</span>
                  )}
                </p>
              </div>
              <button
                onClick={handleRunAssessment}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide text-foreground border border-border rounded-sm hover:bg-secondary transition-colors active:scale-[0.97] disabled:opacity-50"
              >
                {isRunning ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> RUNNING…</>
                ) : assessment ? (
                  <><RotateCcw className="h-3 w-3" /> RE-ASSESS</>
                ) : (
                  <><Play className="h-3 w-3" /> RUN ASSESSMENT</>
                )}
              </button>
            </div>

            {/* Docs warning — assessment will still run but marked as summary-based */}
            {!docsReady && (
              <div className="border border-warning/20 rounded-sm p-4">
                <p className="text-[11px] text-warning font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Official documents not ready
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Assessment will run on summary data only. Results will be marked as incomplete. Download official documents first for a reliable assessment.
                </p>
              </div>
            )}

            {/* Last run error */}
            {runStatus === 'failed' && runError && (
              <div className="border border-destructive/20 rounded-sm p-4">
                <p className="text-[11px] text-destructive font-semibold flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Assessment failed
                </p>
                <p className="text-[12px] text-muted-foreground mt-1 font-mono break-all">{runError}</p>
                <button
                  onClick={handleRunAssessment}
                  disabled={isRunning}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Retry
                </button>
              </div>
            )}

            {/* Assessment results */}
            {assessment ? (
              <>
                {!assessment.based_on_docs && (
                  <div className="border border-warning/20 rounded-sm p-4">
                    <p className="text-[11px] text-warning font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Assessment based on public summary only
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      Official documents have not been downloaded or parsed. Confidence is lower.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Eligibility</p>
                    <StatusChip status={assessment.eligibility} dot className="text-[13px] mb-2" />
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.eligibility_notes}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Complexity</p>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.complexity_notes}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Fit Analysis</p>
                  <p className="text-[13px] text-foreground/80 leading-relaxed">{assessment.fit_notes}</p>
                </div>

                {(assessment.risks?.length ?? 0) > 0 && (
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
            ) : !isRunning && runStatus !== 'failed' ? (
              <div className="py-16 text-center">
                <p className="text-[13px] text-foreground font-semibold">No assessment available</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Click "Run Assessment" above to evaluate eligibility, fit, and risks
                </p>
              </div>
            ) : null}

            {/* Running state */}
            {isRunning && !assessment && (
              <div className="py-16 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto mb-3" />
                <p className="text-[13px] text-foreground font-semibold">Assessment in progress…</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Analyzing eligibility, fit, risks, and generating recommendation
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Action Plan' && (
          <div className="space-y-4">
            {opp.action_items.length > 0 ? opp.action_items.map(action => (
              <div key={action.id} className="flex items-center justify-between py-3.5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const next = action.status === 'done' ? 'pending' : action.status === 'pending' ? 'done' : action.status;
                      updateAction.mutate({ id: action.id, status: next });
                    }}
                    className={`h-2 w-2 rounded-full shrink-0 transition-colors cursor-pointer ${
                      action.status === 'done' ? 'bg-success' :
                      action.status === 'blocked' ? 'bg-destructive' : 'bg-muted-foreground/30'
                    }`}
                  />
                  <div>
                    <p className={`text-[13px] text-foreground ${action.status === 'done' ? 'line-through opacity-50' : ''}`}>{action.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {action.owner && `${action.owner} · `}{action.due_date || 'No deadline'}
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
          <div className="space-y-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a note…"
                className="flex-1 bg-transparent border-b border-border text-[13px] text-foreground placeholder:text-muted-foreground outline-none py-2"
                onKeyDown={e => e.key === 'Enter' && handleSubmitNote()}
              />
              <button
                onClick={handleSubmitNote}
                disabled={!newNote.trim() || addNote.isPending}
                className="px-3 py-1.5 text-[11px] font-bold bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {addNote.isPending ? 'Saving…' : 'Add'}
              </button>
            </div>
            {opp.notes.length > 0 ? opp.notes.map(note => (
              <div key={note.id} className="py-3 border-b border-border/40">
                <p className="text-[13px] text-foreground/80 leading-relaxed">{note.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(note.created_at).toLocaleDateString()}</p>
              </div>
            )) : (
              <div className="py-12 text-center">
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
      <p className="text-[13px] font-medium text-foreground mt-0.5 capitalize">{value || '—'}</p>
    </div>
  );
}

export default OpportunityDetail;
