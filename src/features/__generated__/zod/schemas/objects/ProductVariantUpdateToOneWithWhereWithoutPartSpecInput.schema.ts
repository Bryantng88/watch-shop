import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutPartSpecInputObjectSchema as ProductVariantUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutPartSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutPartSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutPartSpecInput>;
export const ProductVariantUpdateToOneWithWhereWithoutPartSpecInputObjectZodSchema = makeSchema();
