import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateOrConnectWithoutMaintenanceLogsInput.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema).optional(),
  connect: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).optional()
}).strict();
export const approvalRequestsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.approvalRequestsCreateNestedOneWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCreateNestedOneWithoutMaintenanceLogsInput>;
export const approvalRequestsCreateNestedOneWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
