import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutProductVariantInputObjectSchema as ProductUpdateWithoutProductVariantInputObjectSchema } from './ProductUpdateWithoutProductVariantInput.schema';
import { ProductUncheckedUpdateWithoutProductVariantInputObjectSchema as ProductUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ProductUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductVariantInput>;
export const ProductUpdateToOneWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
