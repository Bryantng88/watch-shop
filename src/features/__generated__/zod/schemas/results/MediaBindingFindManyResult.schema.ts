import * as z from 'zod';
export const MediaBindingFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  mediaObjectId: z.string(),
  ownerType: z.unknown(),
  ownerId: z.string(),
  role: z.unknown(),
  sortOrder: z.number().int(),
  audienceSegment: z.unknown(),
  lifecycle: z.unknown(),
  pipelineKey: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  mediaObject: z.unknown()
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