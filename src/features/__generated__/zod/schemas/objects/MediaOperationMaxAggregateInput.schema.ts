import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  idempotencyKey: z.literal(true).optional(),
  mediaObjectId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  status: z.literal(true).optional(),
  sourceKey: z.literal(true).optional(),
  destinationKey: z.literal(true).optional(),
  attempts: z.literal(true).optional(),
  lastError: z.literal(true).optional(),
  requestedByUserId: z.literal(true).optional(),
  startedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MediaOperationMaxAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationMaxAggregateInputType>;
export const MediaOperationMaxAggregateInputObjectZodSchema = makeSchema();
