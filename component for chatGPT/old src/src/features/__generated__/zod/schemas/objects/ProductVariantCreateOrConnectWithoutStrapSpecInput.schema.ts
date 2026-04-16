import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutStrapSpecInputObjectSchema as ProductVariantCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapSpecInput>;
export const ProductVariantCreateOrConnectWithoutStrapSpecInputObjectZodSchema = makeSchema();
