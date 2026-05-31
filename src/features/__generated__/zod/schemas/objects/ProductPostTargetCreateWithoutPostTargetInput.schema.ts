import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutPostTargetsInputObjectSchema as ProductCreateNestedOneWithoutPostTargetsInputObjectSchema } from './ProductCreateNestedOneWithoutPostTargetsInput.schema'

const makeSchema = () => z.object({
  createdAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutPostTargetsInputObjectSchema)
}).strict();
export const ProductPostTargetCreateWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateWithoutPostTargetInput>;
export const ProductPostTargetCreateWithoutPostTargetInputObjectZodSchema = makeSchema();
