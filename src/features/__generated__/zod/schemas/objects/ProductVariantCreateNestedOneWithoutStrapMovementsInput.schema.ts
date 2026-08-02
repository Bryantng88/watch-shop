import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapMovementsInputObjectSchema as ProductVariantCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapMovementsInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapMovementsInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutStrapMovementsInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapMovementsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapMovementsInput>;
export const ProductVariantCreateNestedOneWithoutStrapMovementsInputObjectZodSchema = makeSchema();
