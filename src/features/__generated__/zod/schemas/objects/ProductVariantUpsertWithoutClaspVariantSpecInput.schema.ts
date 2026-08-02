import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutClaspVariantSpecInput.schema';
import { ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutClaspVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutClaspVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutClaspVariantSpecInput>;
export const ProductVariantUpsertWithoutClaspVariantSpecInputObjectZodSchema = makeSchema();
