import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutUserInputObjectSchema as MaintenanceRecordCreateWithoutUserInputObjectSchema } from './MaintenanceRecordCreateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutUserInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutUserInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutUserInput.schema';
import { MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema as MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyUserInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutUserInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutUserInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutUserNestedInput>;
export const MaintenanceRecordUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
