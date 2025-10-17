import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  lengthLabel: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  material: SortOrderSchema.optional(),
  quickRelease: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecOrderByWithRelationInput>;
export const StrapVariantSpecOrderByWithRelationInputObjectZodSchema = makeSchema();
