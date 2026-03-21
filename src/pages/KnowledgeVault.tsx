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
    <div className="p-8 max-w-[1100px] mx-auto space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Knowledge Vault</h1>

      <div className="flex items-center gap-2 border-b border-border pb-0 w-64">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search assets…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[13px] py-1.5"
        />
      </div>

      <div className="divide-y divide-border">
        {filtered.map(asset => (
          <div key={asset.id} className="flex items-start justify-between py-4 cursor-pointer hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">{asset.title}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{asset.summary}</p>
              <div className="flex items-center gap-2 mt-2">
                {asset.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 ml-6 shrink-0 text-right">
              <div>
                <p className="text-[11px] text-muted-foreground">{typeLabels[asset.type]}</p>
                <p className={`text-[11px] font-medium mt-0.5 ${
                  asset.reusePotential === 'high' ? 'text-success' : asset.reusePotential === 'medium' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {asset.reusePotential} reuse
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{asset.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No assets uploaded yet</p>
      )}
    </div>
  );
};

export default KnowledgeVault;
