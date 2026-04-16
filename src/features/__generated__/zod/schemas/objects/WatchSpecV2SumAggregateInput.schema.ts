import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  caseSizeMM: z.literal(true).optional(),
  lugToLugMM: z.literal(true).optional(),
  lugWidthMM: z.literal(true).optional(),
  thicknessMM: z.literal(true).optional(),
  goldKarat: z.literal(true).optional()
}).strict();
export const WatchSpecV2SumAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecV2SumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2SumAggregateInputType>;
export const WatchSpecV2SumAggregateInputObjectZodSchema = makeSchema();
