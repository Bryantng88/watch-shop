import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUpdateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapMovementsInput.schema';
import { ProductVariantCreateWithoutStrapMovementsInputObjectSchema as ProductVariantCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapMovementsInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutStrapMovementsInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutStrapMovementsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutStrapMovementsInput>;
export const ProductVariantUpsertWithoutStrapMovementsInputObjectZodSchema = makeSchema();
