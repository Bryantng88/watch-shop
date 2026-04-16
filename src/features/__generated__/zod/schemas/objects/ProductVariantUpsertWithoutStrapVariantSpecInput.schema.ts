import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapVariantSpecInput.schema';
import { ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutStrapVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutStrapVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutStrapVariantSpecInput>;
export const ProductVariantUpsertWithoutStrapVariantSpecInputObjectZodSchema = makeSchema();
