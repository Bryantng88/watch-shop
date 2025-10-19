import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapSpecInputObjectSchema as ProductVariantCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapSpecInput>;
export const ProductVariantCreateNestedOneWithoutStrapSpecInputObjectZodSchema = makeSchema();
