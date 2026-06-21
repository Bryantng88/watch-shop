import * as z from 'zod';
export const TaskChecklistItemFindFirstResultSchema = z.nullable(z.object({
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
}));