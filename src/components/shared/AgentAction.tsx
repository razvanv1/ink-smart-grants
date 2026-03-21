import { Zap, FileText, Shield, Users, Search, Brain, BarChart3, Target } from "lucide-react";
import { toast } from "sonner";

type AgentActionVariant = 'strategic' | 'drafting' | 'compliance' | 'coordination' | 'knowledge' | 'default';

interface AgentActionProps {
  label: string;
  variant?: AgentActionVariant;
  compact?: boolean;
  className?: string;
}

const variantConfig: Record<AgentActionVariant, { icon: typeof Zap; accent: string }> = {
  strategic: { icon: Target, accent: 'text-primary' },
  drafting: { icon: FileText, accent: 'text-foreground' },
  compliance: { icon: Shield, accent: 'text-warning' },
  coordination: { icon: Users, accent: 'text-info' },
  knowledge: { icon: Search, accent: 'text-success' },
  default: { icon: Zap, accent: 'text-primary' },
};

export function AgentAction({ label, variant = 'default', compact, className = '' }: AgentActionProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <button
      onClick={() => toast.info(`${label}`, { description: 'Agent processing — available in production' })}
      className={`group inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97] ${compact ? '' : 'py-1'} ${className}`}
    >
      <Icon className={`h-3 w-3 ${config.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
      {label}
    </button>
  );
}

interface AgentActionPanelProps {
  actions: { label: string; variant?: AgentActionVariant }[];
  label?: string;
  className?: string;
}

export function AgentActionPanel({ actions, label, className = '' }: AgentActionPanelProps) {
  return (
    <div className={`border-l-2 border-primary/20 pl-4 ${className}`}>
      {label && (
        <p className="text-[9px] text-primary/60 tracking-[0.18em] uppercase font-bold mb-2.5">{label}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {actions.map(a => (
          <AgentAction key={a.label} label={a.label} variant={a.variant} compact />
        ))}
      </div>
    </div>
  );
}

interface AgentActionRowProps {
  actions: { label: string; variant?: AgentActionVariant }[];
  className?: string;
}

export function AgentActionRow({ actions, className = '' }: AgentActionRowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-[9px] text-primary/50 tracking-[0.15em] uppercase font-bold">Agent</span>
      <span className="text-border">·</span>
      {actions.map(a => (
        <AgentAction key={a.label} label={a.label} variant={a.variant} compact />
      ))}
    </div>
  );
}
