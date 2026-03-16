import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryUpdateWithoutProductInputObjectSchema as ProductCategoryUpdateWithoutProductInputObjectSchema } from './ProductCategoryUpdateWithoutProductInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductInput.schema';
import { ProductCategoryCreateWithoutProductInputObjectSchema as ProductCategoryCreateWithoutProductInputObjectSchema } from './ProductCategoryCreateWithoutProductInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductCategoryUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional()
}).strict();
export const ProductCategoryUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpsertWithoutProductInput>;
export const ProductCategoryUpsertWithoutProductInputObjectZodSchema = makeSchema();
