import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsScalarWhereInputObjectSchema as maintenanceLogsScalarWhereInputObjectSchema } from './maintenanceLogsScalarWhereInput.schema';
import { maintenanceLogsUpdateManyMutationInputObjectSchema as maintenanceLogsUpdateManyMutationInputObjectSchema } from './maintenanceLogsUpdateManyMutationInput.schema';
import { maintenanceLogsUncheckedUpdateManyWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedUpdateManyWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedUpdateManyWithoutApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => maintenanceLogsUpdateManyMutationInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateManyWithoutApprovalRequestsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInput>;
export const maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
