import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogScalarWhereInputObjectSchema as ServiceCatalogScalarWhereInputObjectSchema } from './ServiceCatalogScalarWhereInput.schema';
import { ServiceCatalogUpdateManyMutationInputObjectSchema as ServiceCatalogUpdateManyMutationInputObjectSchema } from './ServiceCatalogUpdateManyMutationInput.schema';
import { ServiceCatalogUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateManyWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceCatalogUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInput>;
export const ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
