import { FileText, Shield, Users, Search, Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type AgentActionVariant = 'strategic' | 'drafting' | 'compliance' | 'coordination' | 'knowledge' | 'default';

interface AgentActionProps {
  label: string;
  hint?: string;
  variant?: AgentActionVariant;
  primary?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantConfig: Record<AgentActionVariant, { icon: typeof Target; accent: string; bg: string }> = {
  strategic: { icon: Target, accent: 'text-primary', bg: 'hover:bg-primary/5' },
  drafting: { icon: FileText, accent: 'text-foreground', bg: 'hover:bg-secondary' },
  compliance: { icon: Shield, accent: 'text-warning', bg: 'hover:bg-warning/5' },
  coordination: { icon: Users, accent: 'text-info', bg: 'hover:bg-info/5' },
  knowledge: { icon: Search, accent: 'text-success', bg: 'hover:bg-success/5' },
  default: { icon: Target, accent: 'text-primary', bg: 'hover:bg-primary/5' },
};

export function AgentAction({ label, hint, variant = 'default', primary, className = '', onClick, disabled }: AgentActionProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (primary) {
    return (
      <button
        onClick={onClick || (() => toast.info(label, { description: 'Agent processing, available in production' }))}
        disabled={disabled}
        className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-primary/20 bg-primary/[0.03] text-[11px] font-bold tracking-wide text-foreground hover:border-primary/40 hover:bg-primary/[0.06] transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      >
        <Icon className={`h-3.5 w-3.5 ${config.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
        <span>{label}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 -ml-1 group-hover:opacity-60 group-hover:ml-0 transition-all" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick || (() => toast.info(label, { description: 'Agent processing — available in production' }))}
      disabled={disabled}
      className={`group inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground ${config.bg} transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      title={hint}
    >
      <Icon className={`h-3 w-3 ${config.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
      {label}
    </button>
  );
}

interface AgentActionItem {
  label: string;
  hint?: string;
  variant?: AgentActionVariant;
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface AgentActionPanelProps {
  actions: AgentActionItem[];
  context?: string;
  className?: string;
}

export function AgentActionPanel({ actions, context, className = '' }: AgentActionPanelProps) {
  const primaryActions = actions.filter(a => a.primary);
  const secondaryActions = actions.filter(a => !a.primary);

  return (
    <div className={`${className}`}>
      {context && (
        <p className="text-[11px] text-muted-foreground mb-3">{context}</p>
      )}
      {primaryActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {primaryActions.map(a => (
            <AgentAction key={a.label} label={a.label} hint={a.hint} variant={a.variant} primary onClick={a.onClick} disabled={a.disabled} />
          ))}
        </div>
      )}
      {secondaryActions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {secondaryActions.map(a => (
            <AgentAction key={a.label} label={a.label} hint={a.hint} variant={a.variant} onClick={a.onClick} disabled={a.disabled} />
          ))}
        </div>
      )}
    </div>
  );
}

interface AgentActionRowProps {
  actions: AgentActionItem[];
  className?: string;
}

export function AgentActionRow({ actions, className = '' }: AgentActionRowProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {actions.map(a => (
        <AgentAction key={a.label} label={a.label} hint={a.hint} variant={a.variant} onClick={a.onClick} disabled={a.disabled} />
      ))}
    </div>
  );
}
