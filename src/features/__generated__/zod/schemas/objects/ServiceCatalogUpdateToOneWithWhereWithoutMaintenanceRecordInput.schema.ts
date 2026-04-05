import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
