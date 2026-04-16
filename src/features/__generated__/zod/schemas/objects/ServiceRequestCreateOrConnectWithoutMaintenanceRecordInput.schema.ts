import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutMaintenanceRecordInput>;
export const ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
