import * as z from 'zod';
export const MediaOperationUpdateResultSchema = z.nullable(z.object({
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
}));