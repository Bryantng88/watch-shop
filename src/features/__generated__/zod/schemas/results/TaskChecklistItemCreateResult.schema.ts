import * as z from 'zod';
export const TaskChecklistItemCreateResultSchema = z.object({
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
});