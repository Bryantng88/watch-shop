import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateWithoutPartVariantSpecInput.schema';
import { ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema as ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema } from './ProductVariantUncheckedCreateWithoutPartVariantSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutPartVariantSpecInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutPartVariantSpecInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutPartVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutPartVariantSpecInput>;
export const ProductVariantCreateOrConnectWithoutPartVariantSpecInputObjectZodSchema = makeSchema();
