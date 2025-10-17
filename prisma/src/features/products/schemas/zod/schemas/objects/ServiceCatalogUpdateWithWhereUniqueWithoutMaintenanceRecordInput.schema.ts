import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInput>;
export const ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
