import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageCreateWithoutProductInputObjectSchema as ProductImageCreateWithoutProductInputObjectSchema } from './ProductImageCreateWithoutProductInput.schema';
import { ProductImageUncheckedCreateWithoutProductInputObjectSchema as ProductImageUncheckedCreateWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateWithoutProductInput.schema';
import { ProductImageCreateOrConnectWithoutProductInputObjectSchema as ProductImageCreateOrConnectWithoutProductInputObjectSchema } from './ProductImageCreateOrConnectWithoutProductInput.schema';
import { ProductImageUpsertWithWhereUniqueWithoutProductInputObjectSchema as ProductImageUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ProductImageUpsertWithWhereUniqueWithoutProductInput.schema';
import { ProductImageCreateManyProductInputEnvelopeObjectSchema as ProductImageCreateManyProductInputEnvelopeObjectSchema } from './ProductImageCreateManyProductInputEnvelope.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './ProductImageWhereUniqueInput.schema';
import { ProductImageUpdateWithWhereUniqueWithoutProductInputObjectSchema as ProductImageUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ProductImageUpdateWithWhereUniqueWithoutProductInput.schema';
import { ProductImageUpdateManyWithWhereWithoutProductInputObjectSchema as ProductImageUpdateManyWithWhereWithoutProductInputObjectSchema } from './ProductImageUpdateManyWithWhereWithoutProductInput.schema';
import { ProductImageScalarWhereInputObjectSchema as ProductImageScalarWhereInputObjectSchema } from './ProductImageScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductImageCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductImageCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductImageUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductImageUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductImageCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductImageWhereUniqueInputObjectSchema), z.lazy(() => ProductImageWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductImageWhereUniqueInputObjectSchema), z.lazy(() => ProductImageWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductImageWhereUniqueInputObjectSchema), z.lazy(() => ProductImageWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductImageWhereUniqueInputObjectSchema), z.lazy(() => ProductImageWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductImageUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductImageUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductImageUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ProductImageUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductImageScalarWhereInputObjectSchema), z.lazy(() => ProductImageScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductImageUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ProductImageUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageUpdateManyWithoutProductNestedInput>;
export const ProductImageUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
