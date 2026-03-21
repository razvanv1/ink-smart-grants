import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  new: 'text-info',
  watchlist: 'text-muted-foreground',
  shortlisted: 'text-warning',
  active: 'text-primary',
  'active-workflow': 'text-primary',
  'at-risk': 'text-destructive',
  completed: 'text-success',
  rejected: 'text-muted-foreground',
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

// Dot indicator map
const dotMap: Record<string, string> = {
  'at-risk': 'bg-destructive',
  'active-workflow': 'bg-primary',
  active: 'bg-primary',
  overdue: 'bg-destructive',
  critical: 'bg-destructive',
  'in-progress': 'bg-primary',
  alert: 'bg-destructive',
  warning: 'bg-warning',
};

interface StatusChipProps {
  status: string;
  dot?: boolean;
  className?: string;
}

export function StatusChip({ status, dot, className }: StatusChipProps) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  const color = colorMap[key] || 'text-muted-foreground';
  const dotColor = dotMap[key];
  const label = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase", color, className)}>
      {(dot && dotColor) && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />}
      {label}
    </span>
  );
}
