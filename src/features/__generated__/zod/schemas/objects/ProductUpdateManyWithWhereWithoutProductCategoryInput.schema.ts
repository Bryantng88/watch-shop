import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutProductCategoryInputObjectSchema as ProductUncheckedUpdateManyWithoutProductCategoryInputObjectSchema } from './ProductUncheckedUpdateManyWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutProductCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutProductCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutProductCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutProductCategoryInput>;
export const ProductUpdateManyWithWhereWithoutProductCategoryInputObjectZodSchema = makeSchema();
