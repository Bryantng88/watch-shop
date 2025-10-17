import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  partType: SortOrderSchema.optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PartVariantSpecOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PartVariantSpecOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecOrderByWithRelationInput>;
export const PartVariantSpecOrderByWithRelationInputObjectZodSchema = makeSchema();
