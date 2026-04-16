import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutProductInputObjectSchema as MaintenanceRecordCreateWithoutProductInputObjectSchema } from './MaintenanceRecordCreateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutProductInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutProductInput.schema';
import { MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema as MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyProductInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutProductInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutProductInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInput>;
export const MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
