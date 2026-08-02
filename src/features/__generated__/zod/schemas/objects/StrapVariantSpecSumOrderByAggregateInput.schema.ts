import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  lugWidthMM: SortOrderSchema.optional(),
  buckleWidthMM: SortOrderSchema.optional(),
  claspWidthMM: SortOrderSchema.optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional(),
  defaultFullLinks: SortOrderSchema.optional(),
  defaultHalfLinks: SortOrderSchema.optional(),
  defaultEndLinks: SortOrderSchema.optional()
}).strict();
export const StrapVariantSpecSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecSumOrderByAggregateInput>;
export const StrapVariantSpecSumOrderByAggregateInputObjectZodSchema = makeSchema();
