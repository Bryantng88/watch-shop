import * as z from 'zod';
export const WorkflowExecutionFindManyResultSchema = z.object({
  data: z.array(z.object({
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