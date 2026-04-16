import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutMaintenanceRecordInput>;
export const ServiceRequestCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
