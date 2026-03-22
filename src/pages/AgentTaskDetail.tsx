import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, getTaskEvents, submitReview, retryTask, cancelTask } from "@/services/agentTaskService";
import type { AgentTask, TaskEvent } from "@/types/agentTask";
import { TASK_TYPE_LABELS } from "@/types/agentTask";
import { TaskStatusBadge } from "@/components/agent/TaskStatusBadge";
import { EventLog } from "@/components/agent/EventLog";
import { ResultPanel } from "@/components/agent/ResultPanel";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, XCircle, CheckCircle2, Edit3, Loader2 } from "lucide-react";

export default function AgentTaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<AgentTask | null>(null);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    if (!taskId) return;
    try {
      const [t, e] = await Promise.all([getTask(taskId), getTaskEvents(taskId)]);
      setTask(t);
      setEvents(e);
    } catch {
      toast.error("Task not found");
      navigate("/agent-tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [taskId]);

  const handleReview = async (decision: 'approved' | 'needs_changes') => {
    if (!taskId) return;
    setActionLoading(decision);
    try {
      const updated = await submitReview(taskId, { decision, notes: reviewNotes || undefined });
      setTask(updated);
      setReviewNotes("");
      toast.success(decision === 'approved' ? 'Approved — task resuming' : 'Changes requested — task revising');
    } catch {
      toast.error("Review failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async () => {
    if (!taskId) return;
    setActionLoading('retry');
    try {
      const updated = await retryTask(taskId);
      setTask(updated);
      toast.success("Task re-queued");
    } catch {
      toast.error("Retry failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!taskId) return;
    setActionLoading('cancel');
    try {
      const updated = await cancelTask(taskId);
      setTask(updated);
      toast.success("Task cancelled");
    } catch {
      toast.error("Cancel failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="h-5 w-5 border-2 border-info border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) return null;

  const canReview = task.status === 'waiting_for_input';
  const canRetry = task.status === 'failed' || task.status === 'cancelled';
  const canCancel = task.status === 'queued' || task.status === 'running' || task.status === 'waiting_for_input';

  return (
    <div className="p-6 sm:p-8 max-w-[1000px] mx-auto space-y-8">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/agent-tasks")}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to tasks
        </button>

        <ScrollReveal>
          <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <TaskStatusBadge status={task.status} />
                <span className="text-[11px] text-muted-foreground font-medium">{TASK_TYPE_LABELS[task.type]}</span>
              </div>
              <h1 className="ink-page-title !text-[22px] sm:!text-[26px]">{task.title}</h1>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Created {new Date(task.createdAt).toLocaleString()} · Run {task.runId}
              </p>
            </div>

            {/* Progress ring */}
            <div className="relative h-14 w-14 shrink-0">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke={task.status === 'failed' ? 'hsl(var(--destructive))' : task.status === 'completed' ? 'hsl(var(--success))' : 'hsl(var(--info))'}
                  strokeWidth="2.5"
                  strokeDasharray={`${task.progress * 0.974} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-foreground tabular-nums">
                {task.progress}%
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Current step */}
      {task.currentStep && (
        <ScrollReveal delay={80}>
          <div className="ink-signal py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Step</p>
            <p className="text-[14px] text-foreground font-medium">{task.currentStep}</p>
          </div>
        </ScrollReveal>
      )}

      {/* Error */}
      {task.error && (
        <ScrollReveal delay={80}>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-1">Error</p>
            <p className="text-[13px] text-foreground/80">{task.error}</p>
          </div>
        </ScrollReveal>
      )}

      {/* Human review section */}
      {canReview && (
        <ScrollReveal delay={100}>
          <div className="bg-warning/5 border border-warning/25 rounded-lg p-5 space-y-3">
            <p className="text-[12px] font-bold text-foreground">Human Review Required</p>
            <textarea
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              placeholder="Optional notes for the agent..."
              rows={2}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReview('approved')}
                disabled={actionLoading !== null}
                className="ink-glow-info flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] text-[12px] font-bold rounded-full shadow-md disabled:opacity-40"
              >
                {actionLoading === 'approved' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Approve
              </button>
              <button
                onClick={() => handleReview('needs_changes')}
                disabled={actionLoading !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground text-[12px] font-bold rounded-full border border-border hover:shadow-md transition-all disabled:opacity-40"
              >
                {actionLoading === 'needs_changes' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Edit3 className="h-3.5 w-3.5" />}
                Request Changes
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Actions bar */}
      {(canRetry || canCancel) && (
        <div className="flex items-center gap-2">
          {canRetry && (
            <button
              onClick={handleRetry}
              disabled={actionLoading !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-info text-info-foreground text-[12px] font-bold rounded-full shadow-md ink-glow-info disabled:opacity-40"
            >
              {actionLoading === 'retry' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
              Retry
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={actionLoading !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground text-[12px] font-bold rounded-full border border-border hover:border-destructive/30 hover:text-destructive transition-all disabled:opacity-40"
            >
              {actionLoading === 'cancel' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Result */}
      {task.result && (
        <ScrollReveal delay={120}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Result</p>
            <ResultPanel result={task.result} />
          </div>
        </ScrollReveal>
      )}

      {/* Event log */}
      <ScrollReveal delay={160}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Event Log</p>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <EventLog events={events} />
          </div>
        </div>
      </ScrollReveal>

      {/* Input details */}
      <ScrollReveal delay={200}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Task Input</p>
          <pre className="bg-muted/50 border border-border rounded-lg p-4 text-[11px] text-foreground/70 overflow-x-auto font-mono leading-relaxed">
            {JSON.stringify(task.input, null, 2)}
          </pre>
        </div>
      </ScrollReveal>
    </div>
  );
}
