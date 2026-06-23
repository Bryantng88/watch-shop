import * as z from 'zod';
export const TaskItemChecklistFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskItemId: z.string(),
  title: z.string(),
  note: z.string().optional(),
  isDone: z.boolean(),
  sortOrder: z.number().int(),
  doneAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskItem: z.unknown(),
  Task: z.unknown().optional(),
  taskId: z.string().optional()
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