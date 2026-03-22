/**
 * Mock Agent Task Service
 * ───────────────────────
 * In-memory implementation for development and demos.
 * All data lives in module-scoped arrays — resets on page reload.
 *
 * MOCK MARKER: Every function in this file returns fabricated data.
 * Real backend responses must match the shapes defined in @/types/agentTask.
 */

import type { IAgentTaskService } from './agentTaskService.interface';
import type {
  AgentTask,
  CreateTaskRequest,
  TaskEvent,
  RunDetails,
  ReviewDecision,
} from '@/types/agentTask';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

let nextTaskNum = 7;

const mockTasks: AgentTask[] = [
  {
    taskId: 'task_001', runId: 'run_001', type: 'funding_analysis',
    title: 'Analyze HORIZON-CL4-2026 fit for The Unlearning School',
    status: 'completed', createdAt: '2026-03-20T09:14:00Z', updatedAt: '2026-03-20T09:18:42Z',
    progress: 100, currentStep: 'Completed',
    input: { company_name: 'The Unlearning School', country: 'Greece', brief: 'Digital skills NGO seeking Horizon Europe AI literacy call fit' },
    result: {
      summary: 'Strong fit (92%) — consortium requirement met via existing 8-country network. Recommend starting workflow immediately.',
      structuredOutput: {
        eligibility: 'eligible',
        recommended_programs: ['HORIZON-CL4-2026-HUMAN-01-03'],
        estimated_budget_range: '€2M – €4M',
        key_risks: ['Tight 8-week prep window', 'AI tooling budget scrutiny'],
        next_actions: ['Confirm consortium partners', 'Draft work package structure', 'Assign compliance lead'],
      },
      artifacts: [{ type: 'report', name: 'horizon-fit-analysis.pdf', url: '#' }],
    },
    error: null,
  },
  {
    taskId: 'task_002', runId: 'run_002', type: 'draft_proposal',
    title: 'Build first draft for ERASMUS-EDU-2026-PI',
    status: 'running', createdAt: '2026-03-21T14:22:00Z', updatedAt: '2026-03-22T08:05:12Z',
    progress: 63, currentStep: 'Drafting impact assessment section',
    input: { opportunity_id: 'opp-2', brief: 'Erasmus+ cooperation partnership for digital education innovation' },
    result: null, error: null,
  },
  {
    taskId: 'task_003', runId: 'run_003', type: 'compliance_check',
    title: 'Compliance audit for DIGITAL-2026-SKILLS-04',
    status: 'waiting_for_input', createdAt: '2026-03-21T16:44:00Z', updatedAt: '2026-03-22T07:30:00Z',
    progress: 78, currentStep: 'Awaiting budget breakdown approval',
    input: { opportunity_id: 'opp-3', workflow_id: 'wf-1' },
    options: { requires_human_review: true, priority: 'high' },
    result: null, error: null,
  },
  {
    taskId: 'task_004', runId: 'run_004', type: 'partner_outreach',
    title: 'Draft partner invitation for Widening call',
    status: 'failed', createdAt: '2026-03-19T11:10:00Z', updatedAt: '2026-03-19T11:14:55Z',
    progress: 22, currentStep: 'Failed at partner database lookup',
    input: { opportunity_id: 'opp-7' },
    result: null,
    error: 'Partner database endpoint returned 503 — service temporarily unavailable. Retry recommended.',
  },
  {
    taskId: 'task_005', runId: 'run_005', type: 'portfolio_summary',
    title: 'Weekly portfolio status summary',
    status: 'completed', createdAt: '2026-03-22T06:00:00Z', updatedAt: '2026-03-22T06:03:18Z',
    progress: 100, currentStep: 'Completed',
    input: { brief: 'Generate weekly summary across all active workflows' },
    result: {
      summary: '4 active workflows. 1 at risk (DIGITAL-2026, 19d to deadline, 2 blockers). 1 ready to submit (National GR). Pipeline value: €4.3M.',
      structuredOutput: {
        next_actions: ['Resolve DIGITAL-2026 blockers', 'Submit National GR by Mar 28', 'Start Horizon Europe scoping'],
      },
    },
    error: null,
  },
  {
    taskId: 'task_006', runId: 'run_006', type: 'eligibility_scan',
    title: 'Quick eligibility scan for CERV-2026',
    status: 'queued', createdAt: '2026-03-22T10:45:00Z', updatedAt: '2026-03-22T10:45:00Z',
    progress: 0, currentStep: null,
    input: { opportunity_id: 'opp-5', company_name: 'The Unlearning School', country: 'Greece' },
    result: null, error: null,
  },
];

const mockEvents: Record<string, TaskEvent[]> = {
  task_001: [
    { id: 'evt_1', time: '2026-03-20T09:14:02Z', type: 'status_changed', message: 'Task queued' },
    { id: 'evt_2', time: '2026-03-20T09:14:08Z', type: 'status_changed', message: 'Task started' },
    { id: 'evt_3', time: '2026-03-20T09:15:12Z', type: 'step', message: 'Analyzing call requirements and eligibility criteria' },
    { id: 'evt_4', time: '2026-03-20T09:16:30Z', type: 'step', message: 'Matching against organization profile and prior experience' },
    { id: 'evt_5', time: '2026-03-20T09:17:45Z', type: 'step', message: 'Generating fit score and risk assessment' },
    { id: 'evt_6', time: '2026-03-20T09:18:42Z', type: 'status_changed', message: 'Task completed' },
  ],
  task_002: [
    { id: 'evt_7', time: '2026-03-21T14:22:05Z', type: 'status_changed', message: 'Task queued' },
    { id: 'evt_8', time: '2026-03-21T14:22:30Z', type: 'status_changed', message: 'Task started' },
    { id: 'evt_9', time: '2026-03-21T14:30:00Z', type: 'step', message: 'Loading reusable assets from Knowledge Vault' },
    { id: 'evt_10', time: '2026-03-21T15:10:00Z', type: 'step', message: 'Drafting executive summary and project rationale' },
    { id: 'evt_11', time: '2026-03-22T08:05:12Z', type: 'step', message: 'Drafting impact assessment section' },
  ],
  task_003: [
    { id: 'evt_12', time: '2026-03-21T16:44:10Z', type: 'status_changed', message: 'Task started' },
    { id: 'evt_13', time: '2026-03-21T17:00:00Z', type: 'step', message: 'Checking eligibility documents' },
    { id: 'evt_14', time: '2026-03-22T07:30:00Z', type: 'human_input_required', message: 'Budget breakdown needs approval before compliance sign-off' },
  ],
  task_004: [
    { id: 'evt_15', time: '2026-03-19T11:10:05Z', type: 'status_changed', message: 'Task started' },
    { id: 'evt_16', time: '2026-03-19T11:12:00Z', type: 'step', message: 'Querying partner database for Widening countries' },
    { id: 'evt_17', time: '2026-03-19T11:14:55Z', type: 'error', message: 'Partner database endpoint returned 503' },
  ],
  task_005: [
    { id: 'evt_18', time: '2026-03-22T06:00:05Z', type: 'status_changed', message: 'Task started' },
    { id: 'evt_19', time: '2026-03-22T06:01:30Z', type: 'step', message: 'Aggregating workflow statuses' },
    { id: 'evt_20', time: '2026-03-22T06:03:18Z', type: 'status_changed', message: 'Task completed' },
  ],
  task_006: [],
};

export const mockAgentTaskService: IAgentTaskService = {
  async createTask(req: CreateTaskRequest): Promise<AgentTask> {
    await delay(600);
    const taskId = `task_${String(++nextTaskNum).padStart(3, '0')}`;
    const runId = `run_${String(nextTaskNum).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const task: AgentTask = {
      taskId, runId, type: req.type, title: req.title,
      status: 'queued', createdAt: now, updatedAt: now,
      progress: 0, currentStep: null,
      input: req.input, options: req.options,
      result: null, error: null,
    };
    mockTasks.unshift(task);
    mockEvents[taskId] = [{ id: `evt_auto_${Date.now()}`, time: now, type: 'status_changed', message: 'Task queued' }];
    return task;
  },

  async getTask(taskId: string): Promise<AgentTask> {
    await delay(300);
    const task = mockTasks.find(t => t.taskId === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    return { ...task };
  },

  async listTasks(): Promise<AgentTask[]> {
    await delay(400);
    return mockTasks.map(t => ({ ...t }));
  },

  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    await delay(250);
    return mockEvents[taskId] ?? [];
  },

  async getRunDetails(runId: string): Promise<RunDetails> {
    await delay(300);
    const task = mockTasks.find(t => t.runId === runId);
    if (!task) throw new Error(`Run ${runId} not found`);
    return {
      runId, taskId: task.taskId, status: task.status,
      agent: { runtime: 'openclaw', mode: 'isolated_session' },
      startedAt: task.createdAt,
      finishedAt: task.status === 'completed' || task.status === 'failed' ? task.updatedAt : null,
      outputPreview: task.result?.summary ?? null,
      error: task.error,
    };
  },

  async submitReview(taskId: string, review: ReviewDecision): Promise<AgentTask> {
    await delay(500);
    const task = mockTasks.find(t => t.taskId === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.status = 'running';
    task.currentStep = review.decision === 'approved'
      ? 'Resuming after approval'
      : `Revising: ${review.notes || 'changes requested'}`;
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  async retryTask(taskId: string): Promise<AgentTask> {
    await delay(500);
    const task = mockTasks.find(t => t.taskId === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.status = 'queued';
    task.progress = 0;
    task.currentStep = null;
    task.error = null;
    task.runId = `run_${String(++nextTaskNum).padStart(3, '0')}`;
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  async cancelTask(taskId: string): Promise<AgentTask> {
    await delay(300);
    const task = mockTasks.find(t => t.taskId === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    task.status = 'cancelled';
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },
};
