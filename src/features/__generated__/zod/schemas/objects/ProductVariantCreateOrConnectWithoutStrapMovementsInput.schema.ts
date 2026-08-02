import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutStrapMovementsInputObjectSchema as ProductVariantCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantCreateWithoutStrapMovementsInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapMovementsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapMovementsInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapMovementsInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapMovementsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapMovementsInput>;
export const ProductVariantCreateOrConnectWithoutStrapMovementsInputObjectZodSchema = makeSchema();
