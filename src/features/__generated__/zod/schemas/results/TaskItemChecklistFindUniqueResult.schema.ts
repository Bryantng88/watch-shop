import * as z from 'zod';
export const TaskItemChecklistFindUniqueResultSchema = z.nullable(z.object({
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
}));