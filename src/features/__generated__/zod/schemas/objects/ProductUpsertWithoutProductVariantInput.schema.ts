import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutProductVariantInputObjectSchema as ProductUpdateWithoutProductVariantInputObjectSchema } from './ProductUpdateWithoutProductVariantInput.schema';
import { ProductUncheckedUpdateWithoutProductVariantInputObjectSchema as ProductUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ProductUncheckedUpdateWithoutProductVariantInput.schema';
import { ProductCreateWithoutProductVariantInputObjectSchema as ProductCreateWithoutProductVariantInputObjectSchema } from './ProductCreateWithoutProductVariantInput.schema';
import { ProductUncheckedCreateWithoutProductVariantInputObjectSchema as ProductUncheckedCreateWithoutProductVariantInputObjectSchema } from './ProductUncheckedCreateWithoutProductVariantInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductVariantInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutProductVariantInput>;
export const ProductUpsertWithoutProductVariantInputObjectZodSchema = makeSchema();
