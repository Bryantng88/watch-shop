import * as z from 'zod';
export const WorkflowActionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  workflowId: z.string(),
  actionType: z.unknown(),
  sortOrder: z.number().int(),
  configJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workflow: z.unknown()
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