import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  large?: boolean;
  className?: string;
}

export function ScoreBadge({ score, label, large, className }: ScoreBadgeProps) {
  const color = score >= 75 ? 'text-success' : score >= 50 ? 'text-foreground' : 'text-destructive';
  return (
    <span className={cn(
      large ? "ink-score" : "text-[13px] font-bold",
      color,
      className
    )} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {score}
      {label && <span className="text-[11px] font-normal text-muted-foreground ml-1">{label}</span>}
    </span>
  );
}

/**
 * INK Readiness — segmented geometric blocks
 * The ownable readiness visualization for INK
 */
interface ReadinessBarProps {
  score: number;
  segments?: number;
  className?: string;
}

export function ReadinessBar({ score, segments = 10, className }: ReadinessBarProps) {
  const filled = Math.round((score / 100) * segments);
  const variant = score >= 65 ? 'filled' : score >= 40 ? 'filled-warn' : 'filled-danger';

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="ink-segments">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={`ink-segment ${i < filled ? variant : ''}`} />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{score}</span>
    </div>
  );
}

interface UrgencyIndicatorProps {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function UrgencyIndicator({ urgency, className }: UrgencyIndicatorProps) {
  const bars = { low: 1, medium: 2, high: 3, critical: 4 };
  const color = urgency === 'critical' ? 'bg-destructive' : urgency === 'high' ? 'bg-primary' : urgency === 'medium' ? 'bg-warning' : 'bg-muted-foreground/30';

  return (
    <div className={cn("flex items-end gap-[2px] h-3.5", className)} title={urgency}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-sm transition-colors",
            i <= bars[urgency] ? color : 'bg-border',
          )}
          style={{ height: `${40 + i * 15}%` }}
        />
      ))}
    </div>
  );
}
