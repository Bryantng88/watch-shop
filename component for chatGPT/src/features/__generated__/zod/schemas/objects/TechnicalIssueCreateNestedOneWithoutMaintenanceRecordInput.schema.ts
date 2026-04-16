import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInput>;
export const TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
