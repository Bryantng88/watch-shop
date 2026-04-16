import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutPartSpecInputObjectSchema as ProductVariantCreateWithoutPartSpecInputObjectSchema } from './ProductVariantCreateWithoutPartSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartSpecInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutPartSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutPartSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutPartSpecInput>;
export const ProductVariantCreateOrConnectWithoutPartSpecInputObjectZodSchema = makeSchema();
