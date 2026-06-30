import * as z from 'zod';
export const BusinessFeedbackUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string().optional(),
  actorUserId: z.string().optional(),
  message: z.string(),
  visibility: z.string(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));