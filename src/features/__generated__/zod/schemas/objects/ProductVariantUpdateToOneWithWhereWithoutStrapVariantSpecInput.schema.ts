import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInput>;
export const ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInputObjectZodSchema = makeSchema();
