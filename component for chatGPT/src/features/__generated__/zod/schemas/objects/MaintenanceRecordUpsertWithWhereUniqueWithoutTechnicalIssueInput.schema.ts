import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUpdateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
