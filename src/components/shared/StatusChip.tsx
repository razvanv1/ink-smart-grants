import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  // Opportunity status
  new: 'text-info',
  watchlist: 'text-muted-foreground',
  shortlisted: 'text-warning',
  'active-workflow': 'text-primary',
  ignored: 'text-muted-foreground',
  rejected: 'text-muted-foreground',
  // Workflow status
  active: 'text-primary',
  'at-risk': 'text-destructive',
  completed: 'text-success',
  paused: 'text-muted-foreground',
  submitted: 'text-success',
  // Task status
  todo: 'text-muted-foreground',
  'in-progress': 'text-primary',
  waiting: 'text-warning',
  done: 'text-success',
  blocked: 'text-destructive',
  // Severity
  info: 'text-info',
  attention: 'text-warning',
  risk: 'text-destructive',
  critical: 'text-destructive',
  // Priority
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
  // Misc
  drafted: 'text-success',
  pending: 'text-muted-foreground',
  overdue: 'text-destructive',
  pass: 'text-success',
  warning: 'text-warning',
  missing: 'text-destructive',
  success: 'text-success',
};

const dotMap: Record<string, string> = {
  'at-risk': 'bg-destructive',
  'active-workflow': 'bg-primary',
  active: 'bg-primary',
  blocked: 'bg-destructive',
  overdue: 'bg-destructive',
  critical: 'bg-destructive',
  'in-progress': 'bg-primary',
  risk: 'bg-destructive',
  attention: 'bg-warning',
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
