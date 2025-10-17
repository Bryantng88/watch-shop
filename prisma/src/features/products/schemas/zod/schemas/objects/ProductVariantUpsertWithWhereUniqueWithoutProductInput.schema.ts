import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateWithoutProductInputObjectSchema as ProductVariantUpdateWithoutProductInputObjectSchema } from './ProductVariantUpdateWithoutProductInput.schema';
import { ProductVariantUncheckedUpdateWithoutProductInputObjectSchema as ProductVariantUncheckedUpdateWithoutProductInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutProductInput.schema';
import { ProductVariantCreateWithoutProductInputObjectSchema as ProductVariantCreateWithoutProductInputObjectSchema } from './ProductVariantCreateWithoutProductInput.schema';
import { ProductVariantUncheckedCreateWithoutProductInputObjectSchema as ProductVariantUncheckedCreateWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithWhereUniqueWithoutProductInput>;
export const ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
