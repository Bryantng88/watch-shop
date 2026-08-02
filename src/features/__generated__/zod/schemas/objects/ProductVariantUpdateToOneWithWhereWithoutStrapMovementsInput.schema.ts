import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUpdateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapMovementsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInput>;
export const ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInputObjectZodSchema = makeSchema();
