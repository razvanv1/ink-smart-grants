import { Construction } from "lucide-react";

const KnowledgeVault = () => {
  return (
    <div className="p-8 max-w-[1100px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Institutional Memory</p>
          <h1 className="ink-page-title">Knowledge Vault</h1>
        </div>
      </div>

      <div className="py-24 text-center space-y-4">
        <Construction className="h-8 w-8 text-muted-foreground/30 mx-auto" />
        <div>
          <p className="text-[14px] text-foreground font-semibold">Coming Soon</p>
          <p className="text-[12px] text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
            Upload and manage past applications, reports, templates, and reusable proposal sections.
            The Knowledge Vault will enable AI-powered content reuse across funding applications.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary text-[11px] text-muted-foreground font-medium">
          <div className="h-1.5 w-1.5 rounded-full bg-warning" />
          Requires storage backend
        </div>
      </div>
    </div>
  );
};

export default KnowledgeVault;
