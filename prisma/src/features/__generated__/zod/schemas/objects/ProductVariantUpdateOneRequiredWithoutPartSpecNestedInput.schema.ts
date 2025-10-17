import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutPartSpecInputObjectSchema as ProductVariantCreateWithoutPartSpecInputObjectSchema } from './ProductVariantCreateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutPartSpecInput.schema';
import { ProductVariantUpsertWithoutPartSpecInputObjectSchema as ProductVariantUpsertWithoutPartSpecInputObjectSchema } from './ProductVariantUpsertWithoutPartSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutPartSpecInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutPartSpecInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutPartSpecInput.schema';
import { ProductVariantUpdateWithoutPartSpecInputObjectSchema as ProductVariantUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutPartSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutPartSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutPartSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutPartSpecNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutPartSpecNestedInputObjectZodSchema = makeSchema();
