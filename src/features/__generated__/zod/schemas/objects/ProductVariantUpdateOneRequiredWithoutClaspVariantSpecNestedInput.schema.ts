import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutClaspVariantSpecInput.schema';
import { ProductVariantUpsertWithoutClaspVariantSpecInputObjectSchema as ProductVariantUpsertWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUpsertWithoutClaspVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInput.schema';
import { ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutClaspVariantSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutClaspVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutClaspVariantSpecInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInputObjectZodSchema = makeSchema();
