import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartVariantSpecInput.schema';
import { ProductVariantCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutPartVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutPartVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutPartVariantSpecInput>;
export const ProductVariantUpsertWithoutPartVariantSpecInputObjectZodSchema = makeSchema();
