import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUpdateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)]),
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]),
  where: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional()
}).strict();
export const approvalRequestsUpsertWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpsertWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpsertWithoutMaintenanceLogsInput>;
export const approvalRequestsUpsertWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
