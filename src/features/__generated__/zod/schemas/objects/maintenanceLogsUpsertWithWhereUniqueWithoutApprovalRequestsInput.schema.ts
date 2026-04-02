import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUpdateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => maintenanceLogsUpdateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateWithoutApprovalRequestsInputObjectSchema)]),
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInput>;
export const maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
