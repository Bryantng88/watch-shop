import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUpdateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
