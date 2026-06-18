import * as z from 'zod';
export const TaskExecutionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskId: z.string(),
  targetType: z.unknown(),
  targetId: z.string(),
  actionType: z.unknown(),
  metadataJson: z.unknown().optional(),
  note: z.string().optional(),
  createdByUserId: z.string().optional(),
  createdAt: z.date(),
  task: z.unknown(),
  createdByUser: z.unknown().optional(),
  checklistItem: z.unknown().optional(),
  checklistItemId: z.string().optional()
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