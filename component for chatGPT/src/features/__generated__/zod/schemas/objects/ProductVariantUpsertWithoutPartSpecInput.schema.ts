import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutPartSpecInputObjectSchema as ProductVariantUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartSpecInput.schema';
import { ProductVariantCreateWithoutPartSpecInputObjectSchema as ProductVariantCreateWithoutPartSpecInputObjectSchema } from './ProductVariantCreateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartSpecInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutPartSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutPartSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutPartSpecInput>;
export const ProductVariantUpsertWithoutPartSpecInputObjectZodSchema = makeSchema();
