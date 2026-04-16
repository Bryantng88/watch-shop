import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutProductCategoryInputObjectSchema as ProductUpdateWithoutProductCategoryInputObjectSchema } from './ProductUpdateWithoutProductCategoryInput.schema';
import { ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema as ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedUpdateWithoutProductCategoryInput.schema';
import { ProductCreateWithoutProductCategoryInputObjectSchema as ProductCreateWithoutProductCategoryInputObjectSchema } from './ProductCreateWithoutProductCategoryInput.schema';
import { ProductUncheckedCreateWithoutProductCategoryInputObjectSchema as ProductUncheckedCreateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutProductCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutProductCategoryInput>;
export const ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectZodSchema = makeSchema();
