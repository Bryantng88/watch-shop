import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryCreateWithoutProductInputObjectSchema as ProductCategoryCreateWithoutProductInputObjectSchema } from './ProductCategoryCreateWithoutProductInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductInput.schema';
import { ProductCategoryCreateOrConnectWithoutProductInputObjectSchema as ProductCategoryCreateOrConnectWithoutProductInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutProductInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutProductInput>;
export const ProductCategoryCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();
