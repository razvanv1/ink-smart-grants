import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ScoreBadge({ score, label, size = 'sm', className }: ScoreBadgeProps) {
  const color = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive';
  const bgColor = score >= 75 ? 'bg-success/10' : score >= 50 ? 'bg-warning/10' : 'bg-destructive/10';

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn(
        "font-semibold tabular-nums",
        color,
        bgColor,
        "rounded px-1.5 py-0.5",
        size === 'sm' ? 'text-xs' : 'text-sm',
      )}>
        {score}%
      </span>
      {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
    </div>
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
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

interface UrgencyIndicatorProps {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function UrgencyIndicator({ urgency, className }: UrgencyIndicatorProps) {
  const config = {
    low: { color: 'bg-muted-foreground', label: 'Low' },
    medium: { color: 'bg-warning', label: 'Med' },
    high: { color: 'bg-primary', label: 'High' },
    critical: { color: 'bg-destructive', label: 'Crit' },
  };

  const { color, label } = config[urgency];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
