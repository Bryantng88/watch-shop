import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryCreateWithoutProductInputObjectSchema as ProductCategoryCreateWithoutProductInputObjectSchema } from './ProductCategoryCreateWithoutProductInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductCategoryCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutProductInput>;
export const ProductCategoryCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
