import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  // Call lifecycle
  discovered: 'text-info',
  saved: 'text-muted-foreground',
  docs_pending: 'text-warning',
  docs_ready: 'text-success',
  assessment_pending: 'text-warning',
  assessed: 'text-foreground',
  shortlisted: 'text-warning',
  rejected: 'text-muted-foreground',
  in_preparation: 'text-primary',
  awaiting_documents: 'text-warning',
  drafting: 'text-primary',
  under_review: 'text-info',
  ready_to_submit: 'text-success',
  submitted: 'text-success',
  archived: 'text-muted-foreground',
  // Eligibility
  eligible: 'text-success',
  not_eligible: 'text-destructive',
  uncertain: 'text-warning',
  needs_manual_review: 'text-warning',
  // Judgment
  go: 'text-success',
  watch: 'text-warning',
  no_go: 'text-destructive',
  // Priority
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
  // Legacy opportunity status
  new: 'text-info',
  watchlist: 'text-muted-foreground',
  'active-workflow': 'text-primary',
  ignored: 'text-muted-foreground',
  // Workflow status
  active: 'text-primary',
  'at-risk': 'text-destructive',
  completed: 'text-success',
  paused: 'text-muted-foreground',
  // Task status
  todo: 'text-muted-foreground',
  'in-progress': 'text-primary',
  waiting: 'text-warning',
  done: 'text-success',
  blocked: 'text-destructive',
  pending: 'text-muted-foreground',
  // Severity
  info: 'text-info',
  attention: 'text-warning',
  risk: 'text-destructive',
  critical: 'text-destructive',
  // Misc
  drafted: 'text-success',
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
  go: 'bg-success',
  watch: 'bg-warning',
  no_go: 'bg-destructive',
  eligible: 'bg-success',
  not_eligible: 'bg-destructive',
  uncertain: 'bg-warning',
  ready_to_submit: 'bg-success',
  submitted: 'bg-success',
  drafting: 'bg-primary',
  in_preparation: 'bg-primary',
  docs_pending: 'bg-warning',
  docs_ready: 'bg-success',
  discovered: 'bg-info',
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
  const label = status.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase", color, className)}>
      {(dot && dotColor) && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />}
      {label}
    </span>
  );
}
