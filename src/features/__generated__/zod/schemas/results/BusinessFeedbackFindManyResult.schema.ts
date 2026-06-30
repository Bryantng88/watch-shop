import * as z from 'zod';
export const BusinessFeedbackFindManyResultSchema = z.object({
  data: z.array(z.object({
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