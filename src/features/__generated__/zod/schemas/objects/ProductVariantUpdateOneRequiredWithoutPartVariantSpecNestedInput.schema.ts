import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutPartVariantSpecInput.schema';
import { ProductVariantUpsertWithoutPartVariantSpecInputObjectSchema as ProductVariantUpsertWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUpsertWithoutPartVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInput.schema';
import { ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUpdateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutPartVariantSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutPartVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutPartVariantSpecInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutPartVariantSpecNestedInputObjectZodSchema = makeSchema();
