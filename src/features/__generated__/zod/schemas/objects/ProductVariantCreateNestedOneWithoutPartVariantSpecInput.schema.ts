import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutPartVariantSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutPartVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutPartVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutPartVariantSpecInput>;
export const ProductVariantCreateNestedOneWithoutPartVariantSpecInputObjectZodSchema = makeSchema();
