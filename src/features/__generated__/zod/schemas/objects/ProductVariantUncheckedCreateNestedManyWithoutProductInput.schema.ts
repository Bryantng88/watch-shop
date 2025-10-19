import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutProductInputObjectSchema as ProductVariantCreateWithoutProductInputObjectSchema } from './ProductVariantCreateWithoutProductInput.schema';
import { ProductVariantUncheckedCreateWithoutProductInputObjectSchema as ProductVariantUncheckedCreateWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateWithoutProductInput.schema';
import { ProductVariantCreateOrConnectWithoutProductInputObjectSchema as ProductVariantCreateOrConnectWithoutProductInputObjectSchema } from './ProductVariantCreateOrConnectWithoutProductInput.schema';
import { ProductVariantCreateManyProductInputEnvelopeObjectSchema as ProductVariantCreateManyProductInputEnvelopeObjectSchema } from './ProductVariantCreateManyProductInputEnvelope.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductVariantCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductVariantCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductVariantCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductVariantWhereUniqueInputObjectSchema), z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedCreateNestedManyWithoutProductInput>;
export const ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
