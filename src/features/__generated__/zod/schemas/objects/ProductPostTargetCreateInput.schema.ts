import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutPostTargetsInputObjectSchema as ProductCreateNestedOneWithoutPostTargetsInputObjectSchema } from './ProductCreateNestedOneWithoutPostTargetsInput.schema';
import { PostTargetCreateNestedOneWithoutProductsInputObjectSchema as PostTargetCreateNestedOneWithoutProductsInputObjectSchema } from './PostTargetCreateNestedOneWithoutProductsInput.schema'

const makeSchema = () => z.object({
  createdAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutPostTargetsInputObjectSchema),
  postTarget: z.lazy(() => PostTargetCreateNestedOneWithoutProductsInputObjectSchema)
}).strict();
export const ProductPostTargetCreateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateInput>;
export const ProductPostTargetCreateInputObjectZodSchema = makeSchema();
