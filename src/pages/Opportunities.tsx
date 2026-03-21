import { opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

const statusOptions = ['All', 'New', 'Watchlist', 'Shortlisted', 'Active Workflow', 'Rejected'];

const Opportunities = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = opportunities.filter(opp => {
    const matchesStatus = statusFilter === 'All' || opp.status.replace(/-/g, ' ').toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = opp.callName.toLowerCase().includes(search.toLowerCase()) ||
      opp.programme.toLowerCase().includes(search.toLowerCase()) ||
      opp.thematicArea.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Opportunities</h1>

      {/* Filters — minimal */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border text-sm w-64">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[13px]"
          />
        </div>
        <div className="flex items-center gap-0.5">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded text-[12px] font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table — minimal chrome */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Call</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Programme</th>
              <th className="text-right py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Fit</th>
              <th className="text-right py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden lg:table-cell">Effort</th>
              <th className="text-center py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Urgency</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Deadline</th>
              <th className="text-left py-2.5 pr-4 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-right py-2.5 font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden xl:table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(opp => (
              <tr key={opp.id} className="border-b border-border/60 hover:bg-secondary/40 transition-colors">
                <td className="py-3 pr-4">
                  <Link to={`/opportunities/${opp.id}`} className="text-[13px] font-medium text-foreground hover:text-primary transition-colors">
                    {opp.callName}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-[13px] text-muted-foreground">{opp.programme}</td>
                <td className="py-3 pr-4 text-right"><ScoreBadge score={opp.fitScore} /></td>
                <td className="py-3 pr-4 text-right hidden lg:table-cell"><ScoreBadge score={opp.effortScore} /></td>
                <td className="py-3 pr-4 text-center"><UrgencyIndicator urgency={opp.urgency} /></td>
                <td className="py-3 pr-4 text-[13px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</td>
                <td className="py-3 pr-4"><StatusChip status={opp.status} /></td>
                <td className="py-3 text-right hidden xl:table-cell">
                  <span className="text-[12px] text-primary font-medium">{opp.recommendedAction}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No opportunities match your filters</p>
      )}
    </div>
  );
};

export default Opportunities;
