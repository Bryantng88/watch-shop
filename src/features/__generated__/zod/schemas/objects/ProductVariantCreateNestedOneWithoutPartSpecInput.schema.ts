import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutPartSpecInputObjectSchema as ProductVariantCreateWithoutPartSpecInputObjectSchema } from './ProductVariantCreateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartSpecInput.schema';
import { ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema as ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema } from './ProductVariantCreateOrConnectWithoutPartSpecInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutPartSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutPartSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutPartSpecInput>;
export const ProductVariantCreateNestedOneWithoutPartSpecInputObjectZodSchema = makeSchema();
