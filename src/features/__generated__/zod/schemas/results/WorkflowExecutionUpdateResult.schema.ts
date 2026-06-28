import * as z from 'zod';
export const WorkflowExecutionUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  workflowId: z.string(),
  actionTargetType: z.string(),
  actionTargetId: z.string(),
  status: z.unknown(),
  errorMessage: z.string().optional(),
  metadataJson: z.unknown().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  failedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workflow: z.unknown(),
  events: z.array(z.unknown())
}));