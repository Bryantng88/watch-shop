import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInput>;
export const TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
