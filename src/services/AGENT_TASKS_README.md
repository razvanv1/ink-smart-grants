# Agent Task System — Developer Guide

## Architecture

```
UI Components ──→ agentTaskService.ts (factory) ──→ mockAgentTaskService.ts  (dev)
                                                  └→ httpAgentTaskService.ts  (prod)
```

**Rule:** Components NEVER contain hardcoded mock data. All data flows through the service layer.

## Switching to Production

In `src/services/agentTaskService.ts`, change:

```ts
const USE_MOCK_SERVICE = false;
```

Then update `BASE_URL` in `httpAgentTaskService.ts` to your real backend URL.

## API Contract

| Method | Endpoint | Service Method | Returns |
|--------|----------|---------------|---------|
| POST | `/api/tasks` | `createTask(req)` | `AgentTask` |
| GET | `/api/tasks` | `listTasks()` | `AgentTask[]` |
| GET | `/api/tasks/:taskId` | `getTask(id)` | `AgentTask` |
| GET | `/api/tasks/:taskId/events` | `getTaskEvents(id)` | `TaskEvent[]` |
| GET | `/api/runs/:runId` | `getRunDetails(id)` | `RunDetails` |
| POST | `/api/tasks/:taskId/review` | `submitReview(id, decision)` | `AgentTask` |
| POST | `/api/tasks/:taskId/retry` | `retryTask(id)` | `AgentTask` |
| POST | `/api/tasks/:taskId/cancel` | `cancelTask(id)` | `AgentTask` |

## Task Statuses

```
queued → running → completed
                 → failed
                 → waiting_for_input → (review) → running
any active → cancelled
failed|cancelled → queued (via retry)
```

Valid statuses: `queued`, `running`, `waiting_for_input`, `completed`, `failed`, `cancelled`

The UI renders unknown statuses with a neutral fallback badge.

## Response Safety

The UI safely handles:
- `task.result` = null (not yet completed)
- `task.error` = null (no error)
- `task.currentStep` = null (not started)
- `task.result.structuredOutput` = undefined
- `task.result.artifacts` = undefined or empty array
- `events` = empty array
- Unknown keys in `structuredOutput` (rendered as JSON)
- Missing or unknown `status` values (neutral badge)

## Polling Behavior

- **Task list:** Refreshes every 8 seconds automatically
- **Task detail:** Polls every 5 seconds while status is `queued`, `running`, or `waiting_for_input`
- Polling stops automatically when status is `completed`, `failed`, or `cancelled`

## Confirmation UX

Destructive/important actions require double-click confirmation:
- Cancel task
- Retry task
- Submit review without notes

## File Structure

```
src/
├── types/
│   └── agentTask.ts                    # All TypeScript types
├── services/
│   ├── agentTaskService.interface.ts   # Service contract (IAgentTaskService)
│   ├── agentTaskService.ts             # Factory — exports active implementation
│   ├── mockAgentTaskService.ts         # In-memory mock (MOCK MARKER in comments)
│   └── httpAgentTaskService.ts         # HTTP client for real backend (PLACEHOLDER)
├── components/agent/
│   ├── TaskStatusBadge.tsx             # Status badge with pulse animation
│   ├── CreateTaskForm.tsx              # Task submission form
│   ├── EventLog.tsx                    # Event/log timeline
│   └── ResultPanel.tsx                 # Structured result renderer
└── pages/
    ├── AgentTasks.tsx                  # Task list with polling
    └── AgentTaskDetail.tsx             # Task detail with polling + review
```

## What's Mock Today

Everything in `mockAgentTaskService.ts` is fabricated:
- 6 pre-built tasks in various states
- Event logs per task
- All mutations (create, review, retry, cancel) modify in-memory arrays
- Data resets on page reload

The `httpAgentTaskService.ts` is a **placeholder** — it has the correct fetch structure but points to `/api` which doesn't exist yet.
