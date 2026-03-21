import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ label, value, change, changeType = 'neutral', icon, className }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50",
      className
    )}>
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-muted-foreground font-medium">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</span>
        {change && (
          <span className={cn(
            "text-xs font-medium",
            changeType === 'positive' && "text-success",
            changeType === 'negative' && "text-destructive",
            changeType === 'neutral' && "text-muted-foreground",
          )}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
