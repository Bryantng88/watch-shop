import * as z from 'zod';
export const TimelineEntryFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  containerType: z.unknown(),
  containerId: z.string(),
  sourceType: z.unknown(),
  sourceId: z.string(),
  occurredAt: z.date(),
  actorUserId: z.string().optional(),
  title: z.string().optional(),
  bodySnapshot: z.string().optional(),
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