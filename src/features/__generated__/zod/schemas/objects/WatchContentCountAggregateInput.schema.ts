import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  titleOverride: z.literal(true).optional(),
  summary: z.literal(true).optional(),
  hookText: z.literal(true).optional(),
  body: z.literal(true).optional(),
  bulletSpecs: z.literal(true).optional(),
  seoTitle: z.literal(true).optional(),
  seoDescription: z.literal(true).optional(),
  aiMetaJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const WatchContentCountAggregateInputObjectSchema: z.ZodType<Prisma.WatchContentCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCountAggregateInputType>;
export const WatchContentCountAggregateInputObjectZodSchema = makeSchema();
