import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutProductInputObjectSchema as ProductVariantCreateWithoutProductInputObjectSchema } from './ProductVariantCreateWithoutProductInput.schema';
import { ProductVariantUncheckedCreateWithoutProductInputObjectSchema as ProductVariantUncheckedCreateWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutProductInput>;
export const ProductVariantCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
