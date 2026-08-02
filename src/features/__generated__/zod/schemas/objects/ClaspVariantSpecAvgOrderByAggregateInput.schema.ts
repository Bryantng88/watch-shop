import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  widthMM: SortOrderSchema.optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional()
}).strict();
export const ClaspVariantSpecAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecAvgOrderByAggregateInput>;
export const ClaspVariantSpecAvgOrderByAggregateInputObjectZodSchema = makeSchema();
