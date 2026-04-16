import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInput.schema';
import { MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema as MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema } from './MaintenancePartCreateManyMaintenanceRecordInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInput.schema';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInput>;
export const MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
