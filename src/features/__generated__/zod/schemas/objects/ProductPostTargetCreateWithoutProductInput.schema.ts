import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetCreateNestedOneWithoutProductsInputObjectSchema as PostTargetCreateNestedOneWithoutProductsInputObjectSchema } from './PostTargetCreateNestedOneWithoutProductsInput.schema'

const makeSchema = () => z.object({
  createdAt: z.coerce.date().optional(),
  postTarget: z.lazy(() => PostTargetCreateNestedOneWithoutProductsInputObjectSchema)
}).strict();
export const ProductPostTargetCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateWithoutProductInput>;
export const ProductPostTargetCreateWithoutProductInputObjectZodSchema = makeSchema();
