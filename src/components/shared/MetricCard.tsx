import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
}

export function MetricCard({ label, value, sub, className }: MetricCardProps) {
  return (
    <div className={cn("py-4 px-1", className)}>
      <p className="text-[11px] text-muted-foreground tracking-wide uppercase mb-1">{label}</p>
      <p className="text-2xl font-semibold tracking-tight text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
