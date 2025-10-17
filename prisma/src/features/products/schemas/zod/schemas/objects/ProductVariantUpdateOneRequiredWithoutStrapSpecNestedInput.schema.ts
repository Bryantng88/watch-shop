import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapSpecInputObjectSchema as ProductVariantCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapSpecInput.schema';
import { ProductVariantUpsertWithoutStrapSpecInputObjectSchema as ProductVariantUpsertWithoutStrapSpecInputObjectSchema } from './ProductVariantUpsertWithoutStrapSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutStrapSpecInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutStrapSpecInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutStrapSpecInput.schema';
import { ProductVariantUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutStrapSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapSpecInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInputObjectZodSchema = makeSchema();
