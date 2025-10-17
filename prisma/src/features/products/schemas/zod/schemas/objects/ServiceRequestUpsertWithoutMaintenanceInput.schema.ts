import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceInput.schema';
import { ServiceRequestCreateWithoutMaintenanceInputObjectSchema as ServiceRequestCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutMaintenanceInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutMaintenanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutMaintenanceInput>;
export const ServiceRequestUpsertWithoutMaintenanceInputObjectZodSchema = makeSchema();
