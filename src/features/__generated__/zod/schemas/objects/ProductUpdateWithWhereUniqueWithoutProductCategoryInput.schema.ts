import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutProductCategoryInputObjectSchema as ProductUpdateWithoutProductCategoryInputObjectSchema } from './ProductUpdateWithoutProductCategoryInput.schema';
import { ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema as ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedUpdateWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutProductCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutProductCategoryInput>;
export const ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectZodSchema = makeSchema();
