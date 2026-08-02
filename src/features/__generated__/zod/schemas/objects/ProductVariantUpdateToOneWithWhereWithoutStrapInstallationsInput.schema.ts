import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUpdateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInput>;
export const ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
