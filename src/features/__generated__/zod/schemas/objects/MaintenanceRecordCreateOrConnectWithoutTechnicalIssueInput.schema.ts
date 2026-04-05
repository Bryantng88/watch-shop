import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateWithoutTechnicalIssueInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInput>;
export const MaintenanceRecordCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
