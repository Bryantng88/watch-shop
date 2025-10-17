import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutMaintenanceInputObjectSchema as ServiceRequestCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutMaintenanceInput.schema';
import { ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema as ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutMaintenanceInput.schema';
import { ServiceRequestUpsertWithoutMaintenanceInputObjectSchema as ServiceRequestUpsertWithoutMaintenanceInputObjectSchema } from './ServiceRequestUpsertWithoutMaintenanceInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInput.schema';
import { ServiceRequestUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUpdateWithoutMaintenanceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutMaintenanceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutMaintenanceInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutMaintenanceInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutMaintenanceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutMaintenanceInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneWithoutMaintenanceNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneWithoutMaintenanceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneWithoutMaintenanceNestedInput>;
export const ServiceRequestUpdateOneWithoutMaintenanceNestedInputObjectZodSchema = makeSchema();
