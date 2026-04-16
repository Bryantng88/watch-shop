import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutStrapVariantSpecInput>;
export const ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectZodSchema = makeSchema();
