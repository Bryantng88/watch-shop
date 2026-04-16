import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductCategoryUpdateWithoutProductInputObjectSchema as ProductCategoryUpdateWithoutProductInputObjectSchema } from './ProductCategoryUpdateWithoutProductInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductCategoryUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ProductCategoryUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutProductInput>;
export const ProductCategoryUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
