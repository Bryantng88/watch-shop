import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInput>;
export const ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
