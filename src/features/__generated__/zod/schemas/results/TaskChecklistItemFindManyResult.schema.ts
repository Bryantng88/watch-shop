import * as z from 'zod';
export const TaskChecklistItemFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskId: z.string(),
  title: z.string(),
  note: z.string().optional(),
  isDone: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  task: z.unknown(),
  executions: z.array(z.unknown())
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