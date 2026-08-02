import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  claspType: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  originType: SortOrderSchema.optional(),
  brandName: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  finish: SortOrderSchema.optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ClaspVariantSpecMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecMaxOrderByAggregateInput>;
export const ClaspVariantSpecMaxOrderByAggregateInputObjectZodSchema = makeSchema();
