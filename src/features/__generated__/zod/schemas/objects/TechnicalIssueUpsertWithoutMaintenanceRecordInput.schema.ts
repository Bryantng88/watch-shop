import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUpdateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithoutMaintenanceRecordInput>;
export const TechnicalIssueUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
