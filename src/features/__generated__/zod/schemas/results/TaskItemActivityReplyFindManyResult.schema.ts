import * as z from 'zod';
export const TaskItemActivityReplyFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  activityId: z.string(),
  actorUserId: z.string().optional(),
  body: z.string(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  activity: z.unknown(),
  actorUser: z.unknown().optional()
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