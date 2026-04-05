import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithoutMaintenanceRecordInput>;
export const ServiceCatalogUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
