import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  legacyProductImageId: z.literal(true).optional(),
  key: z.literal(true).optional(),
  url: z.literal(true).optional(),
  type: z.literal(true).optional(),
  role: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  alt: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  mime: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  dominantHex: z.literal(true).optional(),
  contentHash: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchMediaMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchMediaMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaMinAggregateInputType>;
export const WatchMediaMinAggregateInputObjectZodSchema = makeSchema();
