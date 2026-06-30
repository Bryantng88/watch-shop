import * as z from 'zod';
export const UserCommentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional(),
  body: z.string(),
  visibility: z.string(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));