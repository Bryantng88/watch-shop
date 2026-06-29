import * as z from 'zod';
export const WorkflowExecutionEventUpsertResultSchema = z.object({
  id: z.string(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.date(),
  execution: z.unknown(),
  businessEventLog: z.unknown().optional(),
  businessEventLogId: z.string().optional()
});