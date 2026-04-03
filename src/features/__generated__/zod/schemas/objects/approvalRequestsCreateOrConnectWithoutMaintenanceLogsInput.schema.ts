import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)])
}).strict();
export const approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.approvalRequestsCreateOrConnectWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCreateOrConnectWithoutMaintenanceLogsInput>;
export const approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
