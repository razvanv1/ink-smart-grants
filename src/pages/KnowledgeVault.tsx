import { knowledgeAssets } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { Search, Filter, BookOpen, Upload } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  'past-application': 'Past Application',
  'project-description': 'Project Description',
  'report': 'Report',
  'proposal-fragment': 'Proposal Fragment',
  'budget-template': 'Budget Template',
  'organization-doc': 'Organization Doc',
};

const typeFilters = ['All', ...Object.values(typeLabels)];

const KnowledgeVault = () => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = knowledgeAssets.filter(asset => {
    const matchesType = typeFilter === 'All' || typeLabels[asset.type] === typeFilter;
    const matchesSearch = asset.title.toLowerCase().includes(search.toLowerCase()) ||
      asset.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Knowledge Vault</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Reusable institutional knowledge and assets</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
          <Upload className="h-4 w-4" /> Upload Asset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm flex-1 max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {typeFilters.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                typeFilter === f
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(asset => (
          <div key={asset.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-2">
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                asset.reusePotential === 'high' ? 'bg-success/10 text-success' :
                asset.reusePotential === 'medium' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
                {asset.reusePotential} reuse
              </span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{asset.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{asset.summary}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {asset.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">{tag}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{typeLabels[asset.type]}</span>
              <span className="tabular-nums">{asset.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No assets found</p>
          <p className="text-xs text-muted-foreground">Upload documents to build your knowledge vault</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeVault;
