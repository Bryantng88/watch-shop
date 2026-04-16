import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapSpecInput.schema';
import { ProductVariantCreateWithoutStrapSpecInputObjectSchema as ProductVariantCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapSpecInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutStrapSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutStrapSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutStrapSpecInput>;
export const ProductVariantUpsertWithoutStrapSpecInputObjectZodSchema = makeSchema();
