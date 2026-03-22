import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/agentTask";
import { STATUS_LABELS } from "@/types/agentTask";

const statusStyles: Record<TaskStatus, string> = {
  queued: "bg-muted text-muted-foreground",
  running: "bg-info/15 text-info border border-info/30",
  waiting_for_input: "bg-warning/15 text-warning border border-warning/30",
  completed: "bg-success/15 text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]",
  failed: "bg-destructive/10 text-destructive border border-destructive/25",
  cancelled: "bg-muted text-muted-foreground line-through",
};

const pulseStatuses: TaskStatus[] = ['running'];

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase whitespace-nowrap",
        statusStyles[status],
        className,
      )}
    >
      {pulseStatuses.includes(status) && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-info" />
        </span>
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
