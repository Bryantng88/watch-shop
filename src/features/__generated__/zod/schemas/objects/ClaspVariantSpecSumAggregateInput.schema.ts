import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  widthMM: z.literal(true).optional(),
  minStockQty: z.literal(true).optional(),
  targetStockQty: z.literal(true).optional()
}).strict();
export const ClaspVariantSpecSumAggregateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecSumAggregateInputType>;
export const ClaspVariantSpecSumAggregateInputObjectZodSchema = makeSchema();
