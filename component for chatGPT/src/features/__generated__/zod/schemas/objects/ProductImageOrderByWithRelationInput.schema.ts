import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  fileKey: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  alt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  width: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  height: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mime: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  dominantHex: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  contentHash: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ProductImageOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductImageOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageOrderByWithRelationInput>;
export const ProductImageOrderByWithRelationInputObjectZodSchema = makeSchema();
