import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUpdateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
