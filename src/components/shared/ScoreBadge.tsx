import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  const color = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive';
  return (
    <span className={cn("text-[12px] font-semibold", color, className)} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {score}{label ? ` ${label}` : ''}
    </span>
  );
}

interface ReadinessBarProps {
  score: number;
  className?: string;
}

export function ReadinessBar({ score, className }: ReadinessBarProps) {
  const color = score >= 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-medium text-muted-foreground w-7 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{score}%</span>
    </div>
  );
}

interface UrgencyIndicatorProps {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function UrgencyIndicator({ urgency, className }: UrgencyIndicatorProps) {
  const colors = {
    low: 'bg-muted-foreground/30',
    medium: 'bg-warning',
    high: 'bg-primary',
    critical: 'bg-destructive',
  };
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full", colors[urgency])} />
      <span className="text-[11px] text-muted-foreground capitalize">{urgency}</span>
    </div>
  );
}
