import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  reviewStateId: z.literal(true).optional(),
  action: z.literal(true).optional(),
  fromStatus: z.literal(true).optional(),
  toStatus: z.literal(true).optional(),
  actorId: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const WatchReviewLogCountAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogCountAggregateInputType>;
export const WatchReviewLogCountAggregateInputObjectZodSchema = makeSchema();
