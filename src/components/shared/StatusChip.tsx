import { cn } from "@/lib/utils";

type StatusVariant = 'new' | 'watchlist' | 'shortlisted' | 'active' | 'at-risk' | 'completed' | 'rejected' | 'submitted' | 'pending' | 'in-progress' | 'overdue' | 'paused' | 'done' | 'info' | 'warning' | 'success' | 'alert' | 'critical';

const variantStyles: Record<string, string> = {
  new: 'bg-info/15 text-info border-info/20',
  watchlist: 'bg-muted text-muted-foreground border-border',
  shortlisted: 'bg-warning/15 text-warning border-warning/20',
  active: 'bg-primary/15 text-primary border-primary/20',
  'active-workflow': 'bg-primary/15 text-primary border-primary/20',
  'at-risk': 'bg-destructive/15 text-destructive border-destructive/20',
  completed: 'bg-success/15 text-success border-success/20',
  rejected: 'bg-muted text-muted-foreground border-border line-through',
  submitted: 'bg-success/15 text-success border-success/20',
  pending: 'bg-muted text-muted-foreground border-border',
  'in-progress': 'bg-primary/15 text-primary border-primary/20',
  overdue: 'bg-destructive/15 text-destructive border-destructive/20',
  paused: 'bg-muted text-muted-foreground border-border',
  done: 'bg-success/15 text-success border-success/20',
  info: 'bg-info/15 text-info border-info/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  success: 'bg-success/15 text-success border-success/20',
  alert: 'bg-destructive/15 text-destructive border-destructive/20',
  critical: 'bg-destructive/15 text-destructive border-destructive/20',
};

interface StatusChipProps {
  status: string;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const variant = status.toLowerCase().replace(/\s+/g, '-') as StatusVariant;
  const styles = variantStyles[variant] || variantStyles.info;
  const displayLabel = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border",
      styles,
      className
    )}>
      {displayLabel}
    </span>
  );
}
