import type { TaskEvent } from "@/types/agentTask";
import { AlertTriangle, CheckCircle2, Clock, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const eventIcons: Record<TaskEvent['type'], typeof Clock> = {
  status_changed: Clock,
  step: Zap,
  warning: AlertTriangle,
  error: AlertTriangle,
  human_input_required: MessageSquare,
  output: CheckCircle2,
};

const eventColors: Record<TaskEvent['type'], string> = {
  status_changed: 'text-muted-foreground',
  step: 'text-info',
  warning: 'text-warning',
  error: 'text-destructive',
  human_input_required: 'text-warning',
  output: 'text-[hsl(var(--success))]',
};

export function EventLog({ events }: { events: TaskEvent[] }) {
  if (events.length === 0) {
    return <p className="text-[13px] text-muted-foreground py-8 text-center">No events yet</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((evt, i) => {
        const Icon = eventIcons[evt.type];
        return (
          <div
            key={evt.id}
            className={cn(
              "flex items-start gap-3 py-2.5 px-3 rounded-md",
              i % 2 === 0 ? "bg-transparent" : "bg-muted/40",
            )}
          >
            <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", eventColors[evt.type])} />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-foreground/80 leading-relaxed">{evt.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
              {new Date(evt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
