import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapInstallationsInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapInstallationsInput>;
export const ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
