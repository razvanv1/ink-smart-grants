/**
 * Agent Task Service Interface
 * ─────────────────────────────
 * This is the contract between the UI and any backend implementation.
 * All task/event/run data flows through this interface — components
 * MUST NOT contain hardcoded mock data.
 *
 * Current implementations:
 *   - mockAgentTaskService  (dev/demo, uses in-memory data)
 *   - httpAgentTaskService  (production, calls real OpenClaw backend)
 *
 * To switch: set USE_MOCK_SERVICE in agentTaskService.ts
 *
 * ── API Contract ──────────────────────────────────────────────────
 *
 * POST   /api/tasks              → createTask(req) → AgentTask
 * GET    /api/tasks              → listTasks()      → AgentTask[]
 * GET    /api/tasks/:taskId      → getTask(id)      → AgentTask
 * GET    /api/tasks/:taskId/events → getTaskEvents(id) → TaskEvent[]
 * GET    /api/runs/:runId        → getRunDetails(id)  → RunDetails
 * POST   /api/tasks/:taskId/review → submitReview(id, decision) → AgentTask
 * POST   /api/tasks/:taskId/retry  → retryTask(id) → AgentTask
 * POST   /api/tasks/:taskId/cancel → cancelTask(id) → AgentTask
 *
 * ── Status lifecycle ──────────────────────────────────────────────
 *   queued → running → completed
 *                    → failed
 *                    → waiting_for_input → (approved) → running
 *                                        → (needs_changes) → running
 *   any active status → cancelled (via cancelTask)
 *   failed | cancelled → queued (via retryTask)
 *
 * ── Response safety rules ─────────────────────────────────────────
 *   - task.result MAY be null (task not yet completed)
 *   - task.error MAY be null (no error)
 *   - task.currentStep MAY be null (not started)
 *   - task.result.structuredOutput MAY be undefined
 *   - task.result.artifacts MAY be undefined or empty
 *   - events MAY be an empty array
 *   - Unknown status values should render a neutral fallback badge
 */

import type {
  AgentTask,
  CreateTaskRequest,
  TaskEvent,
  RunDetails,
  ReviewDecision,
} from '@/types/agentTask';

export interface IAgentTaskService {
  /** Create and queue a new task */
  createTask(req: CreateTaskRequest): Promise<AgentTask>;

  /** Get a single task by ID. Throws if not found. */
  getTask(taskId: string): Promise<AgentTask>;

  /** List all tasks, ordered by most recent first */
  listTasks(): Promise<AgentTask[]>;

  /** Get the event/log stream for a task */
  getTaskEvents(taskId: string): Promise<TaskEvent[]>;

  /** Get execution run details */
  getRunDetails(runId: string): Promise<RunDetails>;

  /** Submit a human review decision */
  submitReview(taskId: string, review: ReviewDecision): Promise<AgentTask>;

  /** Retry a failed or cancelled task (creates a new run) */
  retryTask(taskId: string): Promise<AgentTask>;

  /** Cancel an active task */
  cancelTask(taskId: string): Promise<AgentTask>;
}
