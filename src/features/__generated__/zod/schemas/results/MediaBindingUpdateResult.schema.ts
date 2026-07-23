import * as z from 'zod';
export const MediaBindingUpdateResultSchema = z.nullable(z.object({
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
}));