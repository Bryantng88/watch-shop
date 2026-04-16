import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutMaintenanceRecordInput>;
export const ServiceRequestUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
