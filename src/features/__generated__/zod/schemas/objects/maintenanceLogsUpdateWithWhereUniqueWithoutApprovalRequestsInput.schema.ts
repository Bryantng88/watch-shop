import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUpdateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInput>;
export const maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
