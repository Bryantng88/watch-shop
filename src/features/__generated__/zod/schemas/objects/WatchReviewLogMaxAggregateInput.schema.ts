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
  createdAt: z.literal(true).optional()
}).strict();
export const WatchReviewLogMaxAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogMaxAggregateInputType>;
export const WatchReviewLogMaxAggregateInputObjectZodSchema = makeSchema();
