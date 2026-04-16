import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutStrapVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutStrapVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutStrapVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutStrapVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutStrapVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutStrapVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutStrapVariantSpecInput>;
export const ProductVariantCreateNestedOneWithoutStrapVariantSpecInputObjectZodSchema = makeSchema();
