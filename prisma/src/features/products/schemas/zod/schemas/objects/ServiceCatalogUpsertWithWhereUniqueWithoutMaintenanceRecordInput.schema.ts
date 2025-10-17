import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInput>;
export const ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
