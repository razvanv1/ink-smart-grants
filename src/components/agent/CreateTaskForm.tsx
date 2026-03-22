import { useState } from "react";
import type { CreateTaskRequest, TaskType } from "@/types/agentTask";
import { TASK_TYPE_LABELS } from "@/types/agentTask";
import { Loader2 } from "lucide-react";

const taskTypes: TaskType[] = [
  'funding_analysis', 'compliance_check', 'draft_proposal',
  'partner_outreach', 'portfolio_summary', 'eligibility_scan',
];

interface Props {
  onSubmit: (req: CreateTaskRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateTaskForm({ onSubmit, isSubmitting }: Props) {
  const [type, setType] = useState<TaskType>('funding_analysis');
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'critical'>('normal');
  const [requiresReview, setRequiresReview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brief.trim()) return;
    await onSubmit({
      type,
      title: title.trim(),
      input: { brief: brief.trim() },
      options: { priority, requires_human_review: requiresReview },
    });
    setTitle('');
    setBrief('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-[14px] font-bold text-foreground tracking-tight">Submit New Task</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wide block mb-1.5">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as TaskType)}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-[13px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
          >
            {taskTypes.map(t => <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wide block mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as 'normal' | 'high' | 'critical')}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-[13px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wide block mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Analyze HORIZON-CL4-2026 fit"
          className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wide block mb-1.5">Brief / Instructions</label>
        <textarea
          value={brief}
          onChange={e => setBrief(e.target.value)}
          placeholder="Describe what this task should accomplish..."
          rows={3}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresReview}
            onChange={e => setRequiresReview(e.target.checked)}
            className="rounded border-border text-info focus:ring-info/30"
          />
          <span className="text-[12px] text-foreground/70">Require human review before finalizing</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !brief.trim()}
        className="ink-glow-info px-5 py-2.5 bg-info text-info-foreground text-[13px] font-bold rounded-full shadow-md shadow-info/20 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
      >
        {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Submit Task
      </button>
    </form>
  );
}
