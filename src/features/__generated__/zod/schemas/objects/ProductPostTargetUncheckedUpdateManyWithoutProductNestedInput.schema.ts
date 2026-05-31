import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateWithoutProductInputObjectSchema as ProductPostTargetCreateWithoutProductInputObjectSchema } from './ProductPostTargetCreateWithoutProductInput.schema';
import { ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema as ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutProductInput.schema';
import { ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema as ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema } from './ProductPostTargetCreateOrConnectWithoutProductInput.schema';
import { ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectSchema as ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ProductPostTargetUpsertWithWhereUniqueWithoutProductInput.schema';
import { ProductPostTargetCreateManyProductInputEnvelopeObjectSchema as ProductPostTargetCreateManyProductInputEnvelopeObjectSchema } from './ProductPostTargetCreateManyProductInputEnvelope.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectSchema as ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ProductPostTargetUpdateWithWhereUniqueWithoutProductInput.schema';
import { ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectSchema as ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectSchema } from './ProductPostTargetUpdateManyWithWhereWithoutProductInput.schema';
import { ProductPostTargetScalarWhereInputObjectSchema as ProductPostTargetScalarWhereInputObjectSchema } from './ProductPostTargetScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductPostTargetCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductPostTargetUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUncheckedUpdateManyWithoutProductNestedInput>;
export const ProductPostTargetUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
