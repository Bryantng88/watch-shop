import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapInstallationsInput>;
export const ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
