import { opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { AgentAction } from "@/components/shared/AgentAction";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

const statusOptions = ['All', 'New', 'Watchlist', 'Shortlisted', 'Active Workflow', 'Ignored', 'Rejected'];

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
    <div className="p-8 max-w-[1300px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Matched Opportunities</p>
          <h1 className="ink-page-title">Opportunities</h1>
        </div>
        <div className="flex items-center gap-4 pb-1">
          <AgentAction label="Compare shortlisted" variant="strategic" />
          <AgentAction label="Find partners" variant="coordination" />
          <span className="text-[11px] text-muted-foreground">{filtered.length} calls</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2 border-b border-border w-56 pb-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[12px]"
          />
        </div>
        <div className="flex items-center gap-0.5">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide transition-colors ${
                statusFilter === s
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
              <th className="text-right py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16">Fit</th>
              <th className="text-right py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16 hidden lg:table-cell">Effort</th>
              <th className="text-center py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase w-16">Urgency</th>
              <th className="text-left py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase">Deadline</th>
              <th className="text-left py-3 pr-6 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase hidden md:table-cell">Status</th>
              <th className="text-right py-3 text-[10px] font-semibold text-muted-foreground tracking-[0.12em] uppercase hidden xl:table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(opp => (
              <tr key={opp.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors group">
                <td className="py-3.5 pr-6">
                  <Link to={`/opportunities/${opp.id}`} className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {opp.callName}
                  </Link>
                </td>
                <td className="py-3.5 pr-6 text-[12px] text-muted-foreground">{opp.programme}</td>
                <td className="py-3.5 pr-6 text-right"><ScoreBadge score={opp.fitScore} /></td>
                <td className="py-3.5 pr-6 text-right hidden lg:table-cell"><ScoreBadge score={opp.effortScore} /></td>
                <td className="py-3.5 pr-6"><div className="flex justify-center"><UrgencyIndicator urgency={opp.urgency} /></div></td>
                <td className="py-3.5 pr-6 text-[12px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{opp.deadline}</td>
                <td className="py-3.5 pr-6 hidden md:table-cell"><StatusChip status={opp.status} /></td>
                <td className="py-3.5 text-right hidden xl:table-cell">
                  <span className="text-[11px] text-primary font-semibold tracking-wide uppercase">{opp.recommendedAction}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[13px] text-foreground font-semibold">No matches found</p>
          <p className="text-[12px] text-muted-foreground mt-1">Adjust filters or run a new scan</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
