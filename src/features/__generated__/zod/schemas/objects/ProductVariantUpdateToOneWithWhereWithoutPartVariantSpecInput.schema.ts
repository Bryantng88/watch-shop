import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInput>;
export const ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInputObjectZodSchema = makeSchema();
