/**
 * Agent Task Service — Factory Export
 * ────────────────────────────────────
 * Toggle USE_MOCK_SERVICE to switch between mock and real backend.
 * All UI code imports from this file only.
 */

import type { IAgentTaskService } from './agentTaskService.interface';
import { mockAgentTaskService } from './mockAgentTaskService';
import { httpAgentTaskService } from './httpAgentTaskService';

/**
 * Set to `false` when the real OpenClaw backend is ready.
 * Can also be driven by an env variable:
 *   const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK_TASKS !== 'false';
 */
const USE_MOCK_SERVICE = true;

export const agentTaskService: IAgentTaskService = USE_MOCK_SERVICE
  ? mockAgentTaskService
  : httpAgentTaskService;

// Re-export individual methods for convenience (preserves existing import patterns)
export const createTask = agentTaskService.createTask.bind(agentTaskService);
export const getTask = agentTaskService.getTask.bind(agentTaskService);
export const listTasks = agentTaskService.listTasks.bind(agentTaskService);
export const getTaskEvents = agentTaskService.getTaskEvents.bind(agentTaskService);
export const getRunDetails = agentTaskService.getRunDetails.bind(agentTaskService);
export const submitReview = agentTaskService.submitReview.bind(agentTaskService);
export const retryTask = agentTaskService.retryTask.bind(agentTaskService);
export const cancelTask = agentTaskService.cancelTask.bind(agentTaskService);
