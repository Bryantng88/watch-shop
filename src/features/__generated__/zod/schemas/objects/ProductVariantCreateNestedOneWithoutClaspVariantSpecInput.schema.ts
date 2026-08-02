import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutClaspVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutClaspVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutClaspVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutClaspVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutClaspVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutClaspVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutClaspVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutClaspVariantSpecInput>;
export const ProductVariantCreateNestedOneWithoutClaspVariantSpecInputObjectZodSchema = makeSchema();
