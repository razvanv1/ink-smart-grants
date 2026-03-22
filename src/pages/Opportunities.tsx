import { useOpportunities, getLifecycleLabel, useDownloadDocuments } from "@/hooks/useOpportunities";
import type { OpportunityRow } from "@/hooks/useOpportunities";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { Search, Bookmark, X, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateOpportunity } from "@/hooks/useOpportunities";

const lifecycleFilters = ['All', 'Discovered', 'Saved', 'Docs Pending', 'Assessed', 'Shortlisted', 'In Preparation', 'Rejected'];

const Opportunities = () => {
  const { data: opportunities = [], isLoading, error } = useOpportunities();
  const updateOpp = useUpdateOpportunity();
  const downloadDocs = useDownloadDocuments();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filtered = opportunities.filter((opp: OpportunityRow) => {
    if (filter !== 'All') {
      const label = getLifecycleLabel(opp.lifecycle).toLowerCase();
      if (!label.includes(filter.toLowerCase())) return false;
    }
    const q = search.toLowerCase();
    return opp.call_name.toLowerCase().includes(q) ||
      opp.programme.toLowerCase().includes(q) ||
      opp.thematic_area.toLowerCase().includes(q);
  });

  const needsDocs = filtered.filter(o => o.docs_status === 'not_downloaded' || o.docs_status === 'docs_pending').length;
  const discovered = filtered.filter(o => o.lifecycle === 'discovered').length;

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1300px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-[1300px] mx-auto">
        <div className="py-20 text-center">
          <p className="text-[13px] text-destructive font-semibold">Failed to load opportunities</p>
          <p className="text-[12px] text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const handleSave = (opp: OpportunityRow) => {
    updateOpp.mutate(
      { id: opp.id, updates: { lifecycle: 'saved' } },
      { onSuccess: () => toast.success('Saved to pipeline') }
    );
  };

  const handleReject = (opp: OpportunityRow) => {
    updateOpp.mutate(
      { id: opp.id, updates: { lifecycle: 'rejected' } },
      { onSuccess: () => toast.success('Rejected') }
    );
  };

  const handleDownloadDocs = (opp: OpportunityRow) => {
    setDownloadingId(opp.id);
    downloadDocs.mutate(
      { opportunityId: opp.id },
      {
        onSuccess: (res) => toast.success(res.message || 'Document ingestion started'),
        onError: (err) => toast.error((err as Error).message || 'Failed to ingest documents'),
        onSettled: () => setDownloadingId(null),
      }
    );
  };

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Call Intelligence</p>
          <h1 className="ink-page-title">Opportunities</h1>
        </div>
        <div className="flex items-center gap-3 pb-1">
          {needsDocs > 0 && (
            <span className="text-[11px] text-warning font-semibold flex items-center gap-1">
              <FileText className="h-3 w-3" />{needsDocs} need docs
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">{filtered.length} calls · {discovered} new</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2 border-b border-border w-56 pb-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search calls…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[12px]"
          />
        </div>
        <div className="flex items-center gap-0.5">
          {lifecycleFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide transition-colors ${
                filter === s
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase">Call</th>
              <th className="text-left py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase">Programme</th>
              <th className="text-center py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16">Fit</th>
              <th className="text-center py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-20">Status</th>
              <th className="text-center py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16">Docs</th>
              <th className="text-center py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16">Urgency</th>
              <th className="text-left py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase">Deadline</th>
              <th className="text-right py-3 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase hidden xl:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(opp => {
              const hasBlockers = (opp.blockers?.length ?? 0) > 0;
              return (
                <tr key={opp.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors group">
                  <td className="py-3.5 pr-6">
                    <Link to={`/opportunities/${opp.id}`} className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                      {opp.call_name}
                    </Link>
                    {hasBlockers && (
                      <span className="ml-2 text-[10px] text-destructive font-semibold inline-flex items-center gap-0.5">
                        <AlertTriangle className="h-2.5 w-2.5" />{opp.blockers.length}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-6 text-[12px] text-muted-foreground">{opp.programme}</td>
                  <td className="py-3.5 pr-6 text-center"><ScoreBadge score={opp.fit_score} /></td>
                  <td className="py-3.5 pr-6 text-center"><StatusChip status={opp.lifecycle} /></td>
                  <td className="py-3.5 pr-6 text-center"><StatusChip status={opp.docs_status === 'docs_ready' ? 'docs_ready' : opp.docs_status === 'docs_pending' ? 'docs_pending' : 'missing'} /></td>
                  <td className="py-3.5 pr-6"><div className="flex justify-center"><UrgencyIndicator urgency={opp.urgency} /></div></td>
                  <td className="py-3.5 pr-6 text-[12px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline || '—'}</td>
                  <td className="py-3.5 text-right hidden xl:table-cell">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {opp.lifecycle === 'discovered' && (
                        <>
                          <button
                            onClick={(e) => { e.preventDefault(); handleSave(opp); }}
                            className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            title="Save"
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); handleReject(opp); }}
                            className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive"
                            title="Reject"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {opp.docs_status !== 'docs_ready' && opp.lifecycle !== 'rejected' && (
                        <button
                          onClick={(e) => { e.preventDefault(); handleDownloadDocs(opp); }}
                          disabled={downloadDocs.isPending && downloadingId === opp.id}
                          className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
                          title={downloadDocs.isPending && downloadingId === opp.id ? 'Starting ingestion…' : 'Ingest official documents'}
                        >
                          {downloadDocs.isPending && downloadingId === opp.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <FileText className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="py-20 text-center">
          <p className="text-[13px] text-foreground font-semibold">
            {opportunities.length === 0 ? 'No opportunities yet' : 'No matches found'}
          </p>
          <p className="text-[12px] text-muted-foreground mt-1">
            {opportunities.length === 0 ? 'Opportunities will appear here once scanning is configured' : 'Adjust filters or run a new scan'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
