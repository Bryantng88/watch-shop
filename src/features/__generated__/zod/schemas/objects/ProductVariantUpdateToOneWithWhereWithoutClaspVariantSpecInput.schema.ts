import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutClaspVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInput>;
export const ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInputObjectZodSchema = makeSchema();
