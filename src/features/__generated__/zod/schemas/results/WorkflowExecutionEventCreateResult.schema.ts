import * as z from 'zod';
export const WorkflowExecutionEventCreateResultSchema = z.object({
  id: z.string(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  eventLogId: z.string().optional(),
  createdAt: z.date(),
  execution: z.unknown()
});