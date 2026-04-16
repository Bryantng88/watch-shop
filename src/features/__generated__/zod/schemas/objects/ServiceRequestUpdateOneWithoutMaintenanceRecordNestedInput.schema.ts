import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUpsertWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUpsertWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUpsertWithoutMaintenanceRecordInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneWithoutMaintenanceRecordNestedInput>;
export const ServiceRequestUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
