import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutProductInputObjectSchema as ProductVariantCreateWithoutProductInputObjectSchema } from './ProductVariantCreateWithoutProductInput.schema';
import { ProductVariantUncheckedCreateWithoutProductInputObjectSchema as ProductVariantUncheckedCreateWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateWithoutProductInput.schema';
import { ProductVariantCreateOrConnectWithoutProductInputObjectSchema as ProductVariantCreateOrConnectWithoutProductInputObjectSchema } from './ProductVariantCreateOrConnectWithoutProductInput.schema';
import { ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectSchema as ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ProductVariantUpsertWithWhereUniqueWithoutProductInput.schema';
import { ProductVariantCreateManyProductInputEnvelopeObjectSchema as ProductVariantCreateManyProductInputEnvelopeObjectSchema } from './ProductVariantCreateManyProductInputEnvelope.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectSchema as ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ProductVariantUpdateWithWhereUniqueWithoutProductInput.schema';
import { ProductVariantUpdateManyWithWhereWithoutProductInputObjectSchema as ProductVariantUpdateManyWithWhereWithoutProductInputObjectSchema } from './ProductVariantUpdateManyWithWhereWithoutProductInput.schema';
import { ProductVariantScalarWhereInputObjectSchema as ProductVariantScalarWhereInputObjectSchema } from './ProductVariantScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductVariantCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductVariantCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductVariantCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductVariantWhereUniqueInputObjectSchema), z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductVariantWhereUniqueInputObjectSchema), z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductVariantWhereUniqueInputObjectSchema), z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductVariantWhereUniqueInputObjectSchema), z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductVariantUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ProductVariantUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductVariantScalarWhereInputObjectSchema), z.lazy(() => ProductVariantScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductVariantUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedUpdateManyWithoutProductNestedInput>;
export const ProductVariantUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
