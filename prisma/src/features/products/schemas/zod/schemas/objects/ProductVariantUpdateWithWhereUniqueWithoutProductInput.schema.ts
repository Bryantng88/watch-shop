import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateWithoutProductInputObjectSchema as ProductVariantUpdateWithoutProductInputObjectSchema } from './ProductVariantUpdateWithoutProductInput.schema';
import { ProductVariantUncheckedUpdateWithoutProductInputObjectSchema as ProductVariantUncheckedUpdateWithoutProductInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateWithWhereUniqueWithoutProductInput>;
export const ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
