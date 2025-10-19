import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './ProductImageWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ProductImageWhereInputObjectSchema).optional(),
  some: z.lazy(() => ProductImageWhereInputObjectSchema).optional(),
  none: z.lazy(() => ProductImageWhereInputObjectSchema).optional()
}).strict();
export const ProductImageListRelationFilterObjectSchema: z.ZodType<Prisma.ProductImageListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageListRelationFilter>;
export const ProductImageListRelationFilterObjectZodSchema = makeSchema();
