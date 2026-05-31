import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetCreateWithoutPostTargetInputObjectSchema as ProductPostTargetCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutPostTargetInput.schema';
import { ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema as ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateOrConnectWithoutPostTargetInput.schema';
import { ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectSchema as ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectSchema } from './ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInput.schema';
import { ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema as ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema } from './ProductPostTargetCreateManyPostTargetInputEnvelope.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectSchema as ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectSchema } from './ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInput.schema';
import { ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectSchema as ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectSchema } from './ProductPostTargetUpdateManyWithWhereWithoutPostTargetInput.schema';
import { ProductPostTargetScalarWhereInputObjectSchema as ProductPostTargetScalarWhereInputObjectSchema } from './ProductPostTargetScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema).array(), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetCreateOrConnectWithoutPostTargetInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductPostTargetCreateManyPostTargetInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema), z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductPostTargetUpdateManyWithoutPostTargetNestedInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateManyWithoutPostTargetNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyWithoutPostTargetNestedInput>;
export const ProductPostTargetUpdateManyWithoutPostTargetNestedInputObjectZodSchema = makeSchema();
