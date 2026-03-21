import { knowledgeAssets } from "@/data/sampleData";
import { Search } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  'past-application': 'Application',
  'project-description': 'Project',
  'report': 'Report',
  'proposal-fragment': 'Fragment',
  'budget-template': 'Template',
  'organization-doc': 'Organization',
};

const KnowledgeVault = () => {
  const [search, setSearch] = useState('');

  const filtered = knowledgeAssets.filter(asset =>
    asset.title.toLowerCase().includes(search.toLowerCase()) ||
    asset.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-[1100px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Institutional Memory</p>
          <h1 className="ink-page-title">Knowledge Vault</h1>
        </div>
        <div className="flex items-center gap-2 border-b border-border w-48 pb-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[12px]"
          />
        </div>
      </div>

      <div>
        {filtered.map((asset, i) => (
          <div key={asset.id} className="flex items-start gap-6 py-5 border-b border-border/50 cursor-pointer hover:bg-secondary/20 -mx-3 px-3 rounded transition-colors">
            <span className="text-[11px] font-bold text-muted-foreground/30 pt-0.5 w-5 shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[13px] font-bold text-foreground tracking-tight">{asset.title}</p>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${
                  asset.reusePotential === 'high' ? 'text-success' : asset.reusePotential === 'medium' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {asset.reusePotential}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{asset.summary}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="uppercase tracking-wider font-medium">{typeLabels[asset.type]}</span>
                <span>·</span>
                {asset.tags.slice(0, 3).map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>{asset.dateAdded}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-[13px] text-muted-foreground">No assets uploaded yet</p>
      )}
    </div>
  );
};

export default KnowledgeVault;
