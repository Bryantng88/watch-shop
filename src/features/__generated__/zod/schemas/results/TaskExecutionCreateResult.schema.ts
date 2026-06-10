import * as z from 'zod';
export const TaskExecutionCreateResultSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  targetType: z.unknown(),
  targetId: z.string(),
  actionType: z.unknown(),
  note: z.string().optional(),
  createdByUserId: z.string().optional(),
  createdAt: z.date(),
  task: z.unknown(),
  createdByUser: z.unknown().optional()
});