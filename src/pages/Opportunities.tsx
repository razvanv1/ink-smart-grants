import { opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown } from "lucide-react";
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
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Funding calls matched to your profile</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm flex-1 max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search calls, programmes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1">Call <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Programme</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Geography</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fit</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Effort</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Urgency</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Deadline</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden xl:table-cell">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(opp => (
                <tr key={opp.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-3">
                    <Link to={`/opportunities/${opp.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {opp.callName}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{opp.thematicArea}</p>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{opp.programme}</td>
                  <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{opp.geography}</td>
                  <td className="p-3 text-center"><ScoreBadge score={opp.fitScore} /></td>
                  <td className="p-3 text-center hidden lg:table-cell"><ScoreBadge score={opp.effortScore} /></td>
                  <td className="p-3 text-center"><UrgencyIndicator urgency={opp.urgency} /></td>
                  <td className="p-3 text-sm text-muted-foreground tabular-nums">{opp.deadline}</td>
                  <td className="p-3"><StatusChip status={opp.status} /></td>
                  <td className="p-3 hidden xl:table-cell">
                    <span className="text-xs text-primary font-medium">{opp.recommendedAction}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">No opportunities match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
