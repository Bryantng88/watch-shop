import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateOrConnectWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateOrConnectWithoutApprovalRequestsInput>;
export const maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
