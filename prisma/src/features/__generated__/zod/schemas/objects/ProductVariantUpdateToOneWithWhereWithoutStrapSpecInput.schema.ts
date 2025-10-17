import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutStrapSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapSpecInput>;
export const ProductVariantUpdateToOneWithWhereWithoutStrapSpecInputObjectZodSchema = makeSchema();
