import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutRecordInputObjectSchema as MaintenancePartCreateWithoutRecordInputObjectSchema } from './MaintenancePartCreateWithoutRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutRecordInput.schema';
import { MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema as MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutRecordInput.schema';
import { MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectSchema as MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectSchema } from './MaintenancePartUpsertWithWhereUniqueWithoutRecordInput.schema';
import { MaintenancePartCreateManyRecordInputEnvelopeObjectSchema as MaintenancePartCreateManyRecordInputEnvelopeObjectSchema } from './MaintenancePartCreateManyRecordInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectSchema as MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectSchema } from './MaintenancePartUpdateWithWhereUniqueWithoutRecordInput.schema';
import { MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectSchema as MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectSchema } from './MaintenancePartUpdateManyWithWhereWithoutRecordInput.schema';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyRecordInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUncheckedUpdateManyWithoutRecordNestedInputObjectSchema: z.ZodType<Prisma.MaintenancePartUncheckedUpdateManyWithoutRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUncheckedUpdateManyWithoutRecordNestedInput>;
export const MaintenancePartUncheckedUpdateManyWithoutRecordNestedInputObjectZodSchema = makeSchema();
