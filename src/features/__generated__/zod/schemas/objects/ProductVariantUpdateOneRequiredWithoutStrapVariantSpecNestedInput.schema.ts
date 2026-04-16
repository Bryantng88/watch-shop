import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapVariantSpecInput.schema';
import { ProductVariantUpsertWithoutStrapVariantSpecInputObjectSchema as ProductVariantUpsertWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUpsertWithoutStrapVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInput.schema';
import { ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapVariantSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutStrapVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapVariantSpecInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutStrapVariantSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapVariantSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapVariantSpecNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutStrapVariantSpecNestedInputObjectZodSchema = makeSchema();
