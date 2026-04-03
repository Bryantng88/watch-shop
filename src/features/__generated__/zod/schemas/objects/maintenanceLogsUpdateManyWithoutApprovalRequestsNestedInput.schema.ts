import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput.schema';
import { maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema as maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateOrConnectWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInput.schema';
import { maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema as maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema } from './maintenanceLogsCreateManyApprovalRequestsInputEnvelope.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInput.schema';
import { maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectSchema as maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectSchema } from './maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInput.schema';
import { maintenanceLogsScalarWhereInputObjectSchema as maintenanceLogsScalarWhereInputObjectSchema } from './maintenanceLogsScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsCreateWithoutApprovalRequestsInputObjectSchema).array(), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsCreateOrConnectWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUpsertWithWhereUniqueWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUpdateWithWhereUniqueWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsUpdateManyWithWhereWithoutApprovalRequestsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema), z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const maintenanceLogsUpdateManyWithoutApprovalRequestsNestedInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateManyWithoutApprovalRequestsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyWithoutApprovalRequestsNestedInput>;
export const maintenanceLogsUpdateManyWithoutApprovalRequestsNestedInputObjectZodSchema = makeSchema();
