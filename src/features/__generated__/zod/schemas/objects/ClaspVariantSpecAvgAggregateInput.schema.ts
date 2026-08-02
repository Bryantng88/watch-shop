import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  widthMM: z.literal(true).optional(),
  minStockQty: z.literal(true).optional(),
  targetStockQty: z.literal(true).optional()
}).strict();
export const ClaspVariantSpecAvgAggregateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecAvgAggregateInputType>;
export const ClaspVariantSpecAvgAggregateInputObjectZodSchema = makeSchema();
