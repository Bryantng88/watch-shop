import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema as ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema } from './ServiceCatalogCreateManyMaintenanceRecordInputEnvelope.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema).array(), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema), z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInput>;
export const ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
