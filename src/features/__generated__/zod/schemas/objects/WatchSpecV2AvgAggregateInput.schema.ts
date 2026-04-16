import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  caseSizeMM: z.literal(true).optional(),
  lugToLugMM: z.literal(true).optional(),
  lugWidthMM: z.literal(true).optional(),
  thicknessMM: z.literal(true).optional(),
  goldKarat: z.literal(true).optional()
}).strict();
export const WatchSpecV2AvgAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2AvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2AvgAggregateInputType>;
export const WatchSpecV2AvgAggregateInputObjectZodSchema = makeSchema();
