import * as z from 'zod';
export const MediaOperationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  idempotencyKey: z.string(),
  mediaObjectId: z.string().optional(),
  type: z.unknown(),
  status: z.unknown(),
  sourceKey: z.string().optional(),
  destinationKey: z.string().optional(),
  attempts: z.number().int(),
  lastError: z.string().optional(),
  requestedByUserId: z.string().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  mediaObject: z.unknown().optional()
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