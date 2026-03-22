import { MetricCard } from "@/components/shared/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { useOpportunities, useSavedCalls, getLifecycleLabel } from "@/hooks/useOpportunities";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, FileText, Loader2, Database } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const { data: allOpps = [], isLoading: oppsLoading } = useOpportunities();
  const { data: saved = [], isLoading: savedLoading } = useSavedCalls();
  const orgId = useOrganizationId();
  const [seeding, setSeeding] = useState(false);
  const qc = useQueryClient();

  const isLoading = oppsLoading || savedLoading;

  const getSeedErrorMessage = async (err: unknown): Promise<string> => {
    const maybeErr = err as { context?: Response; message?: string };

    if (maybeErr?.context) {
      try {
        const payload = await maybeErr.context.json();
        if (payload?.error && typeof payload.error === 'string') {
          return payload.error;
        }
      } catch {
        // ignore JSON parse failures
      }
    }

    if (err instanceof Error && err.message) return err.message;
    if (typeof maybeErr?.message === 'string' && maybeErr.message) return maybeErr.message;
    return 'Failed to seed data';
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      if (!orgId) {
        toast.info('No organization found yet — creating one automatically before seeding.');
      }

      const { data, error } = await supabase.functions.invoke('seed-demo-data');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.message === 'Data already exists') {
        toast.success(`Demo data already loaded (${data?.count ?? 0} records)`);
      } else {
        toast.success(`Seeded ${data?.seeded?.opportunities ?? 0} opportunities with assessments, documents, and action items`);
      }

      qc.invalidateQueries({ queryKey: ['user-org'] });
      qc.invalidateQueries({ queryKey: ['org-name'] });
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['saved-calls'] });
      qc.invalidateQueries({ queryKey: ['opportunity'] });
      qc.invalidateQueries({ queryKey: ['funding-profile'] });
      qc.invalidateQueries({ queryKey: ['org-detail'] });
    } catch (err: unknown) {
      toast.error(await getSeedErrorMessage(err));
    } finally {
      setSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const goDecisions = saved.filter(o => o.assessment?.judgment === 'go');
  const blocked = saved.filter(o => (o.blockers?.length ?? 0) > 0);
  const needsDocs = saved.filter(o => o.docs_status !== 'docs_ready');
  const submitted = saved.filter(o => o.lifecycle === 'submitted');
  const newCalls = allOpps.filter(o => o.lifecycle === 'discovered');

  const topPriority = saved
    .filter(o => o.priority === 'high' && o.lifecycle !== 'submitted')
    .sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    });

  const nearDeadlines = saved
    .filter(o => o.lifecycle !== 'submitted' && o.lifecycle !== 'archived' && o.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 4);

  const nextActions = saved
    .filter(o => o.action_items?.some(a => a.status !== 'done') && o.lifecycle !== 'submitted')
    .sort((a, b) => {
      const prio = { high: 0, medium: 1, low: 2 };
      return prio[a.priority] - prio[b.priority];
    })
    .slice(0, 5);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Funding Operations</p>
          <h1 className="ink-page-title">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-muted-foreground">Live · Auto-refresh</span>
        </div>
      </div>

      {/* Empty state with seed */}
      {allOpps.length === 0 && (
        <div className="py-16 text-center space-y-4 border border-border/60 rounded-sm">
          <Database className="h-8 w-8 text-muted-foreground/30 mx-auto" />
          <div>
            <p className="text-[14px] text-foreground font-semibold">No data yet</p>
            <p className="text-[12px] text-muted-foreground mt-1 max-w-md mx-auto">
              Your database is empty. Load demo data to explore the platform, or wait for the scanning agent to discover real opportunities.
            </p>
          </div>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-[12px] font-bold tracking-wide rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-50"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
            {seeding ? 'Seeding…' : 'Load Demo Data'}
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8">
        <MetricCard label="Saved Calls" value={saved.length} sub={`${newCalls.length} newly discovered`} />
        <MetricCard label="Go Decisions" value={goDecisions.length} sub={`${submitted.length} submitted`} />
        <MetricCard label="Blocked" value={blocked.length} accent={blocked.length > 0} sub={blocked.length > 0 ? `${blocked.reduce((s, o) => s + (o.blockers?.length ?? 0), 0)} total blockers` : 'All clear'} />
        <MetricCard label="Docs Missing" value={needsDocs.length} sub={needsDocs.length > 0 ? 'Assessment blocked' : 'All docs ready'} />
        <MetricCard label="High Priority" value={topPriority.length} sub="need action" />
      </div>

      {/* Blocked calls alert */}
      {blocked.length > 0 && (
        <div className="border border-destructive/20 rounded-sm p-4">
          <p className="text-[10px] text-destructive tracking-[0.12em] uppercase font-semibold mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Blocked Calls
          </p>
          {blocked.map(opp => (
            <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center justify-between py-2 group">
              <div>
                <p className="text-[13px] text-foreground group-hover:text-primary transition-colors font-semibold">{opp.call_name}</p>
                <p className="text-[11px] text-muted-foreground">{opp.blockers?.[0]}</p>
              </div>
              {opp.deadline && (
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[12px] font-bold text-destructive" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {Math.max(0, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000))}d
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="ink-rule" />

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-10">
          {/* Recommended Next Actions */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Recommended Next Actions</h2>
              <Link to="/pipeline" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Pipeline <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {nextActions.map(opp => {
              const nextAction = opp.action_items?.find(a => a.status !== 'done');
              if (!nextAction) return null;
              return (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3.5 border-b border-border/60 last:border-0 group">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{opp.call_name}</p>
                      <p className="text-[11px] text-foreground/60 mt-1 flex items-center gap-1">
                        <ArrowRight className="h-2.5 w-2.5 text-primary" />
                        {nextAction.action}
                        {nextAction.owner && <span className="text-muted-foreground ml-1">· {nextAction.owner}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <StatusChip status={opp.lifecycle} />
                      <UrgencyIndicator urgency={opp.urgency} />
                    </div>
                  </div>
                </Link>
              );
            })}
            {nextActions.length === 0 && (
              <p className="py-12 text-center text-[13px] text-muted-foreground">No pending actions</p>
            )}
          </section>

          {/* Top Priority Calls */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground">Top Priorities</h2>
              <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {topPriority.slice(0, 4).map((opp, i) => (
              <Link key={opp.id} to={`/opportunities/${opp.id}`} className="flex items-center justify-between py-3 border-b border-border/60 last:border-0 group">
                <div className="min-w-0 flex-1 flex items-center gap-4">
                  <span className="text-[11px] font-bold text-muted-foreground/40 w-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{opp.call_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{opp.programme} · {opp.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
                  <ScoreBadge score={opp.fit_score} />
                  {opp.assessment && <StatusChip status={opp.assessment.judgment} dot />}
                </div>
              </Link>
            ))}
            {topPriority.length === 0 && (
              <p className="py-12 text-center text-[13px] text-muted-foreground">No high-priority calls</p>
            )}
          </section>
        </div>

        <div className="lg:col-span-2 space-y-10">
          {/* Deadlines */}
          <section>
            <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-muted-foreground mb-5">Nearest Deadlines</h2>
            {nearDeadlines.map(opp => {
              const daysLeft = Math.max(0, Math.ceil((new Date(opp.deadline!).getTime() - Date.now()) / 86400000));
              return (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3 border-b border-border/60 last:border-0 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate">{opp.call_name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{getLifecycleLabel(opp.lifecycle)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-[13px] font-bold ${daysLeft <= 7 ? 'text-destructive' : daysLeft <= 21 ? 'text-warning' : 'text-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {daysLeft}d
                      </p>
                      <p className="text-[10px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {nearDeadlines.length === 0 && (
              <p className="py-8 text-center text-[13px] text-muted-foreground">No upcoming deadlines</p>
            )}
          </section>

          {/* Docs Missing */}
          {needsDocs.length > 0 && (
            <section>
              <h2 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-warning mb-5 flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Documents Needed
              </h2>
              {needsDocs.map(opp => (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} className="block py-3 border-b border-border/60 last:border-0 group">
                  <p className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate">{opp.call_name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {opp.docs_status === 'not_downloaded' ? 'Not downloaded' : 'Pending parsing'} · Assessment blocked
                  </p>
                </Link>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
