import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUpdateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapInstallationsInput.schema';
import { ProductVariantCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutStrapInstallationsInput>;
export const ProductVariantUpsertWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
