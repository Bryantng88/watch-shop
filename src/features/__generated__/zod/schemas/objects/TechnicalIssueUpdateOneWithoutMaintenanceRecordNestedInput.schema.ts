import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUpsertWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUpsertWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUpsertWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUpdateWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalIssueUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInput>;
export const TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
