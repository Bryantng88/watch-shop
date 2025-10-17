import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutMaintenanceInputObjectSchema as ServiceRequestCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceInput.schema';
import { ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema as ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutMaintenanceInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutMaintenanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutMaintenanceInput>;
export const ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectZodSchema = makeSchema();
