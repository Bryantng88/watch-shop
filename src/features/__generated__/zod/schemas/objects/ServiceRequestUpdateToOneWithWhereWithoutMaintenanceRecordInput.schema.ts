import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
