import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listTasks, createTask } from "@/services/agentTaskService";
import type { AgentTask, CreateTaskRequest } from "@/types/agentTask";
import { TASK_TYPE_LABELS } from "@/types/agentTask";
import { TaskStatusBadge } from "@/components/agent/TaskStatusBadge";
import { CreateTaskForm } from "@/components/agent/CreateTaskForm";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { toast } from "sonner";
import { Plus, ChevronRight, Clock } from "lucide-react";

export default function AgentTasks() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await listTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (req: CreateTaskRequest) => {
    setSubmitting(true);
    try {
      await createTask(req);
      await fetchTasks();
      setShowForm(false);
      toast.success("Task submitted");
    } catch {
      toast.error("Failed to create task");
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
          <span className="text-[11px] text-muted-foreground">
            {activeCount} active · {reviewCount} awaiting review
          </span>
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

      {/* Task list */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-5 w-5 border-2 border-info border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[14px] text-muted-foreground mb-3">No tasks yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="ink-glow-info px-5 py-2.5 bg-info text-info-foreground text-[13px] font-bold rounded-full"
          >
            Submit your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <ScrollReveal key={task.taskId} delay={i * 40}>
              <Link
                to={`/agent-tasks/${task.taskId}`}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-foreground/15 transition-all group"
              >
                {/* Progress indicator */}
                <div className="relative h-10 w-10 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke={task.status === 'failed' ? 'hsl(var(--destructive))' : task.status === 'completed' ? 'hsl(var(--success))' : 'hsl(var(--info))'}
                      strokeWidth="2.5"
                      strokeDasharray={`${task.progress * 0.974} 100`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground/70 tabular-nums">
                    {task.progress}%
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-foreground truncate group-hover:text-info transition-colors">{task.title}</span>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/50">{TASK_TYPE_LABELS[task.type]}</span>
                    <span>·</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
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
