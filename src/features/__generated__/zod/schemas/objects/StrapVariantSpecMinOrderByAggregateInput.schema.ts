import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  material: SortOrderSchema.optional(),
  quickRelease: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  lugWidthMM: SortOrderSchema.optional(),
  buckleWidthMM: SortOrderSchema.optional(),
  originType: SortOrderSchema.optional(),
  brandName: SortOrderSchema.optional(),
  leatherType: SortOrderSchema.optional(),
  surface: SortOrderSchema.optional(),
  inventoryPolicy: SortOrderSchema.optional(),
  claspType: SortOrderSchema.optional(),
  claspWidthMM: SortOrderSchema.optional(),
  claspOriginType: SortOrderSchema.optional(),
  finish: SortOrderSchema.optional(),
  lengthClass: SortOrderSchema.optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional(),
  braceletReference: SortOrderSchema.optional(),
  defaultFullLinks: SortOrderSchema.optional(),
  defaultHalfLinks: SortOrderSchema.optional(),
  defaultEndLinks: SortOrderSchema.optional()
}).strict();
export const StrapVariantSpecMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecMinOrderByAggregateInput>;
export const StrapVariantSpecMinOrderByAggregateInputObjectZodSchema = makeSchema();
