import * as z from 'zod';
export const TaskExecutionUpsertResultSchema = z.object({
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
  createdByUser: z.unknown().optional()
});