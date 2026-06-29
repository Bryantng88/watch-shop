import * as z from 'zod';
export const WorkflowExecutionEventFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.date(),
  execution: z.unknown(),
  businessEventLog: z.unknown().optional(),
  businessEventLogId: z.string().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});