import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateOrConnectWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUpsertWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUpsertWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUpsertWithoutMaintenanceLogsInput.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUpdateWithoutMaintenanceLogsInput.schema';
import { approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => approvalRequestsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema).optional(),
  upsert: z.lazy(() => approvalRequestsUpsertWithoutMaintenanceLogsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => approvalRequestsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => approvalRequestsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => approvalRequestsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)]).optional()
}).strict();
export const approvalRequestsUpdateOneWithoutMaintenanceLogsNestedInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpdateOneWithoutMaintenanceLogsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpdateOneWithoutMaintenanceLogsNestedInput>;
export const approvalRequestsUpdateOneWithoutMaintenanceLogsNestedInputObjectZodSchema = makeSchema();
