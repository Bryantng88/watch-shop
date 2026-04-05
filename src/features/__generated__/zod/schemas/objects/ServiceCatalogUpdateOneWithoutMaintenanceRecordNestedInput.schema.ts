import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUpsertWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpsertWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpsertWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceCatalogUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInput>;
export const ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
