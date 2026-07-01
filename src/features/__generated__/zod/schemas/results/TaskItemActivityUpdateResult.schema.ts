import * as z from 'zod';
export const TaskItemActivityUpdateResultSchema = z.nullable(z.object({
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
}));