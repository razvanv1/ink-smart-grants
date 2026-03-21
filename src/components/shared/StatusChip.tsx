import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  new: 'text-info',
  watchlist: 'text-muted-foreground',
  shortlisted: 'text-warning',
  active: 'text-primary',
  'active-workflow': 'text-primary',
  'at-risk': 'text-destructive',
  completed: 'text-success',
  rejected: 'text-muted-foreground line-through',
  submitted: 'text-success',
  pending: 'text-muted-foreground',
  'in-progress': 'text-primary',
  overdue: 'text-destructive',
  paused: 'text-muted-foreground',
  done: 'text-success',
  drafted: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  success: 'text-success',
  alert: 'text-destructive',
  critical: 'text-destructive',
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
  pass: 'text-success',
  missing: 'text-destructive',
};

interface StatusChipProps {
  status: string;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  const color = styles[key] || 'text-muted-foreground';
  const label = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={cn("text-[11px] font-medium", color, className)}>
      {label}
    </span>
  );
}
