import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema as AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema } from './AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelope.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogScalarWhereInputObjectSchema as AcquisitionSpecJobLogScalarWhereInputObjectSchema } from './AcquisitionSpecJobLogScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema).array(), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInput>;
export const AcquisitionSpecJobLogUpdateManyWithoutAcquisitionSpecJobNestedInputObjectZodSchema = makeSchema();
