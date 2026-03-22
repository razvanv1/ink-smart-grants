import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { listTasks, getTaskEvents } from "@/services/agentTaskService";
import type { AgentTask, TaskEvent, TaskType } from "@/types/agentTask";
import { TASK_TYPE_LABELS, STATUS_LABELS } from "@/types/agentTask";
import { TaskStatusBadge } from "@/components/agent/TaskStatusBadge";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  RefreshCw, AlertTriangle, Zap, Clock, MessageSquare, CheckCircle2,
  Activity, ChevronRight, Filter,
} from "lucide-react";

const POLL_INTERVAL = 10_000;

interface ActivityEntry {
  taskId: string;
  taskTitle: string;
  taskType: TaskType;
  taskStatus: AgentTask["status"];
  event: TaskEvent;
}

const eventIcons: Record<TaskEvent["type"], typeof Clock> = {
  status_changed: Clock,
  step: Zap,
  warning: AlertTriangle,
  error: AlertTriangle,
  human_input_required: MessageSquare,
  output: CheckCircle2,
};

const eventDotColors: Record<TaskEvent["type"], string> = {
  status_changed: "bg-muted-foreground",
  step: "bg-info",
  warning: "bg-warning",
  error: "bg-destructive",
  human_input_required: "bg-warning",
  output: "bg-[hsl(var(--success))]",
};

const eventTextColors: Record<TaskEvent["type"], string> = {
  status_changed: "text-muted-foreground",
  step: "text-info",
  warning: "text-warning",
  error: "text-destructive",
  human_input_required: "text-warning",
  output: "text-[hsl(var(--success))]",
};

type FilterType = "all" | "errors" | "review" | "steps";

export default function AgentActivity() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const taskList = await listTasks();
      setTasks(taskList);

      // Fetch events for all tasks in parallel
      const eventsPerTask = await Promise.all(
        taskList.map(async (t) => {
          try {
            const events = await getTaskEvents(t.taskId);
            return events.map((evt): ActivityEntry => ({
              taskId: t.taskId,
              taskTitle: t.title,
              taskType: t.type,
              taskStatus: t.status,
              event: evt,
            }));
          } catch {
            return [];
          }
        })
      );

      // Flatten and sort by time descending
      const flat = eventsPerTask
        .flat()
        .sort((a, b) => new Date(b.event.time).getTime() - new Date(a.event.time).getTime());
      setActivity(flat);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    pollRef.current = setInterval(() => fetchAll(true), POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchAll]);

  const filtered = activity.filter((a) => {
    if (filter === "all") return true;
    if (filter === "errors") return a.event.type === "error" || a.event.type === "warning";
    if (filter === "review") return a.event.type === "human_input_required";
    if (filter === "steps") return a.event.type === "step";
    return true;
  });

  const activeCount = tasks.filter(t => t.status === "running" || t.status === "queued").length;
  const failedCount = tasks.filter(t => t.status === "failed").length;
  const reviewCount = tasks.filter(t => t.status === "waiting_for_input").length;

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "errors", label: "Errors", count: activity.filter(a => a.event.type === "error" || a.event.type === "warning").length },
    { key: "review", label: "Review", count: activity.filter(a => a.event.type === "human_input_required").length },
    { key: "steps", label: "Steps" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[1100px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">System Intelligence</p>
          <h1 className="ink-page-title">Agent Activity</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {activeCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
                {activeCount} active
              </span>
            )}
            {reviewCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                {reviewCount} review
              </span>
            )}
            {failedCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {failedCount} failed
              </span>
            )}
          </div>
          <button
            onClick={() => fetchAll(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Tasks", value: tasks.length, icon: Activity },
              { label: "Active Now", value: activeCount, icon: Zap },
              { label: "Awaiting Review", value: reviewCount, icon: MessageSquare },
              { label: "Failed", value: failedCount, icon: AlertTriangle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[20px] font-extrabold text-foreground tabular-nums leading-none">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Filters */}
      {!loading && !error && activity.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-full transition-colors ${
                filter === key
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {count !== undefined && count > 0 && (
                <span className="ml-1.5 tabular-nums">{count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-2 border-info border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] text-muted-foreground">Loading activity…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-bold text-foreground mb-1">Failed to load activity</p>
            <p className="text-[12px] text-muted-foreground max-w-[400px]">{error}</p>
          </div>
          <button
            onClick={() => fetchAll()}
            className="ink-glow-info px-5 py-2 bg-info text-info-foreground text-[12px] font-bold rounded-full"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && activity.length === 0 && (
        <div className="py-16 text-center">
          <Activity className="h-7 w-7 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-[14px] text-muted-foreground mb-1">No activity yet</p>
          <p className="text-[12px] text-muted-foreground/70">
            Events will appear here as agents run tasks.
          </p>
        </div>
      )}

      {/* Activity feed */}
      {!loading && !error && filtered.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" aria-hidden="true" />

          <div className="space-y-0">
            {filtered.map((entry, i) => {
              const Icon = eventIcons[entry.event.type];
              const time = new Date(entry.event.time);
              const showDate =
                i === 0 ||
                new Date(filtered[i - 1].event.time).toDateString() !== time.toDateString();

              return (
                <div key={entry.event.id}>
                  {showDate && (
                    <div className="relative flex items-center gap-3 py-3 pl-10">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                    </div>
                  )}
                  <ScrollReveal delay={Math.min(i * 30, 300)}>
                    <div className="relative flex items-start gap-3 py-2 pl-0 group">
                      {/* Dot */}
                      <div className="relative z-10 h-9 w-9 flex items-center justify-center shrink-0">
                        <div className={`h-2.5 w-2.5 rounded-full ${eventDotColors[entry.event.type]} ring-4 ring-background`} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1 bg-card border border-border rounded-lg px-4 py-3 group-hover:border-foreground/15 group-hover:shadow-sm transition-all">
                        <div className="flex items-start gap-2">
                          <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${eventTextColors[entry.event.type]}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-foreground/80 leading-relaxed">{entry.event.message}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Link
                                to={`/agent-tasks/${entry.taskId}`}
                                className="text-[11px] text-info hover:underline font-medium truncate max-w-[250px] flex items-center gap-1"
                              >
                                {entry.taskTitle}
                                <ChevronRight className="h-3 w-3 shrink-0" />
                              </Link>
                              <span className="text-[10px] text-muted-foreground/60">
                                {TASK_TYPE_LABELS[entry.taskType]}
                              </span>
                              <TaskStatusBadge status={entry.taskStatus} />
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
                            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtered empty */}
      {!loading && !error && activity.length > 0 && filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[13px] text-muted-foreground">No events match this filter.</p>
        </div>
      )}
    </div>
  );
}
