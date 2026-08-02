import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  claspType: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  originType: SortOrderSchema.optional(),
  brandName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finish: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  ProductVariant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ClaspVariantSpecOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecOrderByWithRelationInput>;
export const ClaspVariantSpecOrderByWithRelationInputObjectZodSchema = makeSchema();
