/**
 * HTTP Agent Task Service — Production Implementation
 * ────────────────────────────────────────────────────
 * Calls the real OpenClaw backend API.
 *
 * PLACEHOLDER: Replace BASE_URL with your actual backend endpoint.
 * All methods follow the contract in agentTaskService.interface.ts.
 *
 * Expected backend responses must match the types in @/types/agentTask.ts exactly.
 * See agentTaskService.interface.ts for full API contract documentation.
 */

import type { IAgentTaskService } from './agentTaskService.interface';
import type {
  AgentTask,
  CreateTaskRequest,
  TaskEvent,
  RunDetails,
  ReviewDecision,
} from '@/types/agentTask';

/**
 * TODO: Replace with real backend URL.
 * Options:
 *   - Supabase Edge Function: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-tasks`
 *   - Direct backend: `https://your-api.example.com/api`
 */
const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth header when backend requires it
      // 'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

export const httpAgentTaskService: IAgentTaskService = {
  async createTask(req: CreateTaskRequest): Promise<AgentTask> {
    return request<AgentTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async getTask(taskId: string): Promise<AgentTask> {
    return request<AgentTask>(`/tasks/${taskId}`);
  },

  async listTasks(): Promise<AgentTask[]> {
    return request<AgentTask[]>('/tasks');
  },

  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    const data = await request<{ taskId: string; events: TaskEvent[] }>(`/tasks/${taskId}/events`);
    return data.events ?? [];
  },

  async getRunDetails(runId: string): Promise<RunDetails> {
    return request<RunDetails>(`/runs/${runId}`);
  },

  async submitReview(taskId: string, review: ReviewDecision): Promise<AgentTask> {
    return request<AgentTask>(`/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  async retryTask(taskId: string): Promise<AgentTask> {
    return request<AgentTask>(`/tasks/${taskId}/retry`, { method: 'POST' });
  },

  async cancelTask(taskId: string): Promise<AgentTask> {
    return request<AgentTask>(`/tasks/${taskId}/cancel`, { method: 'POST' });
  },
};
