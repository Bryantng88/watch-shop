import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema as MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyTechnicalIssueInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInput>;
export const MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
