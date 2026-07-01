import * as z from 'zod';
export const TaskItemActivityFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskItemId: z.string(),
  sourceType: z.unknown(),
  sourceId: z.string().optional(),
  title: z.string(),
  body: z.string().optional(),
  status: z.unknown(),
  actorUserId: z.string().optional(),
  metadataJson: z.unknown().optional(),
  occurredAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskItem: z.unknown(),
  actorUser: z.unknown().optional(),
  replies: z.array(z.unknown())
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