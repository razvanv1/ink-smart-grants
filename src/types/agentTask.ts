// OpenClaw Agent Task System — API contract types

export type TaskStatus = 'queued' | 'running' | 'waiting_for_input' | 'completed' | 'failed' | 'cancelled';

export type TaskType =
  | 'funding_analysis'
  | 'compliance_check'
  | 'draft_proposal'
  | 'partner_outreach'
  | 'portfolio_summary'
  | 'eligibility_scan';

export interface TaskInput {
  company_name?: string;
  website?: string;
  country?: string;
  brief?: string;
  opportunity_id?: string;
  workflow_id?: string;
  [key: string]: unknown;
}

export interface TaskOptions {
  priority?: 'low' | 'normal' | 'high' | 'critical';
  requires_human_review?: boolean;
}

export interface CreateTaskRequest {
  type: TaskType;
  title: string;
  input: TaskInput;
  options?: TaskOptions;
}

export interface TaskArtifact {
  type: 'report' | 'draft' | 'checklist' | 'analysis';
  name: string;
  url: string;
}

export interface TaskResult {
  summary: string;
  structuredOutput?: {
    eligibility?: string;
    recommended_programs?: string[];
    estimated_budget_range?: string;
    key_risks?: string[];
    next_actions?: string[];
    [key: string]: unknown;
  };
  artifacts?: TaskArtifact[];
}

export interface AgentTask {
  taskId: string;
  runId: string;
  type: TaskType;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  progress: number;
  currentStep: string | null;
  input: TaskInput;
  options?: TaskOptions;
  result: TaskResult | null;
  error: string | null;
}

export interface TaskEvent {
  id: string;
  time: string;
  type: 'status_changed' | 'step' | 'warning' | 'error' | 'human_input_required' | 'output';
  message: string;
}

export interface RunDetails {
  runId: string;
  taskId: string;
  status: TaskStatus;
  agent: {
    runtime: string;
    mode: string;
  };
  startedAt: string;
  finishedAt: string | null;
  outputPreview: string | null;
  error: string | null;
}

export interface ReviewDecision {
  decision: 'approved' | 'needs_changes' | 'rejected';
  notes?: string;
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  funding_analysis: 'Funding Analysis',
  compliance_check: 'Compliance Check',
  draft_proposal: 'Draft Proposal',
  partner_outreach: 'Partner Outreach',
  portfolio_summary: 'Portfolio Summary',
  eligibility_scan: 'Eligibility Scan',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  waiting_for_input: 'Awaiting Review',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};
