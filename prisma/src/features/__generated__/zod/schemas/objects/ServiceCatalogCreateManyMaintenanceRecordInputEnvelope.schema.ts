import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateManyMaintenanceRecordInputObjectSchema as ServiceCatalogCreateManyMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateManyMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceCatalogCreateManyMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogCreateManyMaintenanceRecordInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateManyMaintenanceRecordInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateManyMaintenanceRecordInputEnvelope>;
export const ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectZodSchema = makeSchema();
