import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapMovementsInputObjectSchema as ProductVariantCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapMovementsInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapMovementsInput.schema';
import { ProductVariantUpsertWithoutStrapMovementsInputObjectSchema as ProductVariantUpsertWithoutStrapMovementsInputObjectSchema } from './ProductVariantUpsertWithoutStrapMovementsInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInput.schema';
import { ProductVariantUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUpdateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutStrapMovementsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutStrapMovementsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutStrapMovementsInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInput>;
export const ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInputObjectZodSchema = makeSchema();
