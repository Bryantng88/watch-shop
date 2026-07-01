import * as z from 'zod';
export const TaskItemActivityReplyFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  activityId: z.string(),
  actorUserId: z.string().optional(),
  body: z.string(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  activity: z.unknown(),
  actorUser: z.unknown().optional()
}));