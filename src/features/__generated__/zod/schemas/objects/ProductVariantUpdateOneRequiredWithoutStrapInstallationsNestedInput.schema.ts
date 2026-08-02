import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapInstallationsInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapInstallationsInput.schema';
import { ProductVariantUpsertWithoutStrapInstallationsInputObjectSchema as ProductVariantUpsertWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUpsertWithoutStrapInstallationsInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInput.schema';
import { ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUpdateWithoutStrapInstallationsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapInstallationsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutStrapInstallationsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectZodSchema = makeSchema();
