import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema';
import { approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUpdateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)])
}).strict();
export const approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInput>;
export const approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
