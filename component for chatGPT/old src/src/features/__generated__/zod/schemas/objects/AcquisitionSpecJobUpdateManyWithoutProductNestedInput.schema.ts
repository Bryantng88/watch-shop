import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutProductInputObjectSchema as AcquisitionSpecJobCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutProductInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutProductInput.schema';
import { AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectSchema as AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInput.schema';
import { AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema as AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema } from './AcquisitionSpecJobCreateManyProductInputEnvelope.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectSchema as AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInput.schema';
import { AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectSchema as AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectSchema } from './AcquisitionSpecJobUpdateManyWithWhereWithoutProductInput.schema';
import { AcquisitionSpecJobScalarWhereInputObjectSchema as AcquisitionSpecJobScalarWhereInputObjectSchema } from './AcquisitionSpecJobScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema).array(), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionSpecJobCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionSpecJobUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateManyWithoutProductNestedInput>;
export const AcquisitionSpecJobUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
