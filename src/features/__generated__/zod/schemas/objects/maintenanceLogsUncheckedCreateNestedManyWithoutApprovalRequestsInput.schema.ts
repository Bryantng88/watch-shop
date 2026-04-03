import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateOrConnectWithoutApprovalRequestsInput.schema';
import { maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema as maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema } from './maintenanceLogsCreateManyApprovalRequestsInputEnvelope.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema).array(), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const maintenanceLogsUncheckedCreateNestedManyWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUncheckedCreateNestedManyWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUncheckedCreateNestedManyWithoutApprovalRequestsInput>;
export const maintenanceLogsUncheckedCreateNestedManyWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
