import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema as MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyTechnicalIssueInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInput>;
export const MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
