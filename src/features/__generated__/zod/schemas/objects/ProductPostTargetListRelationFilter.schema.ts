import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereInputObjectSchema as ProductPostTargetWhereInputObjectSchema } from './ProductPostTargetWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ProductPostTargetWhereInputObjectSchema).optional(),
  some: z.lazy(() => ProductPostTargetWhereInputObjectSchema).optional(),
  none: z.lazy(() => ProductPostTargetWhereInputObjectSchema).optional()
}).strict();
export const ProductPostTargetListRelationFilterObjectSchema: z.ZodType<Prisma.ProductPostTargetListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetListRelationFilter>;
export const ProductPostTargetListRelationFilterObjectZodSchema = makeSchema();
