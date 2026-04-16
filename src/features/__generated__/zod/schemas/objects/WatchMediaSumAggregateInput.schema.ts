import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional()
}).strict();
export const WatchMediaSumAggregateInputObjectSchema: z.ZodType<Prisma.WatchMediaSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaSumAggregateInputType>;
export const WatchMediaSumAggregateInputObjectZodSchema = makeSchema();
