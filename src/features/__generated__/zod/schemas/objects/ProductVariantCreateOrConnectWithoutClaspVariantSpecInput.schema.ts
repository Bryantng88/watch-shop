import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutClaspVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutClaspVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutClaspVariantSpecInput>;
export const ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectZodSchema = makeSchema();
