import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInputObjectZodSchema = makeSchema();
