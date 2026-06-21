import * as z from 'zod';
export const TaskChecklistItemFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskId: z.string(),
  title: z.string(),
  note: z.string().optional(),
  status: z.unknown(),
  priority: z.unknown(),
  dueAt: z.date().optional(),
  assignedToUserId: z.string().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  isDone: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  task: z.unknown(),
  assignedToUser: z.unknown().optional(),
  executions: z.array(z.unknown()),
  User: z.unknown().optional(),
  userId: z.string().optional()
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