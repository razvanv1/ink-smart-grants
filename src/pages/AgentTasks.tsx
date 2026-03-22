import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { listTasks, createTask } from "@/services/agentTaskService";
import type { AgentTask, CreateTaskRequest } from "@/types/agentTask";
import { TASK_TYPE_LABELS } from "@/types/agentTask";
import { TaskStatusBadge } from "@/components/agent/TaskStatusBadge";
import { CreateTaskForm } from "@/components/agent/CreateTaskForm";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { toast } from "sonner";
import { Plus, ChevronRight, Clock, AlertTriangle, RefreshCw } from "lucide-react";

const POLL_INTERVAL = 8_000; // 8 seconds

export default function AgentTasks() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load tasks";
      setError(msg);
      if (!silent) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchTasks();
    pollRef.current = setInterval(() => fetchTasks(true), POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchTasks]);

  const handleCreate = async (req: CreateTaskRequest) => {
    setSubmitting(true);
    try {
      await createTask(req);
      await fetchTasks(true);
      setShowForm(false);
      toast.success("Task submitted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = tasks.filter(t => t.status === 'running' || t.status === 'queued').length;
  const reviewCount = tasks.filter(t => t.status === 'waiting_for_input').length;

  return (
    <div className="p-6 sm:p-8 max-w-[1100px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">OpenClaw Runtime</p>
          <h1 className="ink-page-title">Agent Tasks</h1>
        </div>
        <div className="flex items-center gap-3">
          {!loading && !error && (
            <span className="text-[11px] text-muted-foreground">
              {activeCount} active · {reviewCount} awaiting review
            </span>
          )}
          <button
            onClick={() => fetchTasks(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="ink-glow-info flex items-center gap-1.5 px-4 py-2 bg-info text-info-foreground text-[12px] font-bold rounded-full shadow-md shadow-info/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <ScrollReveal>
          <CreateTaskForm onSubmit={handleCreate} isSubmitting={submitting} />
        </ScrollReveal>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-2 border-info border-t-transparent rounded-full animate-spin" />
          <p className="text-[12px] text-muted-foreground">Loading tasks…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-bold text-foreground mb-1">Failed to load tasks</p>
            <p className="text-[12px] text-muted-foreground max-w-[400px]">{error}</p>
          </div>
          <button
            onClick={() => fetchTasks()}
            className="ink-glow-info px-5 py-2 bg-info text-info-foreground text-[12px] font-bold rounded-full"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tasks.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[14px] text-muted-foreground mb-1">No tasks yet</p>
          <p className="text-[12px] text-muted-foreground/70 mb-5">Submit a task to get your agents working.</p>
          <button
            onClick={() => setShowForm(true)}
            className="ink-glow-info px-5 py-2.5 bg-info text-info-foreground text-[13px] font-bold rounded-full"
          >
            Submit your first task
          </button>
        </div>
      )}

      {/* Task list */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <ScrollReveal key={task.taskId} delay={i * 40}>
              <Link
                to={`/agent-tasks/${task.taskId}`}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-foreground/15 transition-all group"
              >
                {/* Progress ring */}
                <div className="relative h-10 w-10 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke={task.status === 'failed' ? 'hsl(var(--destructive))' : task.status === 'completed' ? 'hsl(var(--success))' : 'hsl(var(--info))'}
                      strokeWidth="2.5"
                      strokeDasharray={`${(task.progress ?? 0) * 0.974} 100`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground/70 tabular-nums">
                    {task.progress ?? 0}%
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-foreground truncate group-hover:text-info transition-colors">
                      {task.title || 'Untitled Task'}
                    </span>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/50">
                      {TASK_TYPE_LABELS[task.type] ?? task.type}
                    </span>
                    <span>·</span>
                    <Clock className="h-3 w-3" />
                    <span>{task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '—'}</span>
                    {task.currentStep && (
                      <>
                        <span>·</span>
                        <span className="truncate max-w-[200px]">{task.currentStep}</span>
                      </>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
