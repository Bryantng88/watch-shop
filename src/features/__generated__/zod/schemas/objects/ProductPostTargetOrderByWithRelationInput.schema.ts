import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { PostTargetOrderByWithRelationInputObjectSchema as PostTargetOrderByWithRelationInputObjectSchema } from './PostTargetOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  postTargetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  postTarget: z.lazy(() => PostTargetOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ProductPostTargetOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductPostTargetOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetOrderByWithRelationInput>;
export const ProductPostTargetOrderByWithRelationInputObjectZodSchema = makeSchema();
