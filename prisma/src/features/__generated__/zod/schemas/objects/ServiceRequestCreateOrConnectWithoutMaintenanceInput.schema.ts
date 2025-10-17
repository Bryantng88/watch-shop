import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutMaintenanceInputObjectSchema as ServiceRequestCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutMaintenanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutMaintenanceInput>;
export const ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectZodSchema = makeSchema();
