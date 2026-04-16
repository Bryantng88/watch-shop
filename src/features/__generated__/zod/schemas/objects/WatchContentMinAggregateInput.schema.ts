import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  titleOverride: z.literal(true).optional(),
  summary: z.literal(true).optional(),
  hookText: z.literal(true).optional(),
  body: z.literal(true).optional(),
  seoTitle: z.literal(true).optional(),
  seoDescription: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchContentMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchContentMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentMinAggregateInputType>;
export const WatchContentMinAggregateInputObjectZodSchema = makeSchema();
