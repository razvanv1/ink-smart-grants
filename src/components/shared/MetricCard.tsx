import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function MetricCard({ label, value, sub, accent, className }: MetricCardProps) {
  return (
    <div className={cn("py-5", accent && "ink-accent-border", className)}>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium mb-2">{label}</p>
      <p className="ink-score">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-1.5">{sub}</p>}
    </div>
  );
}
