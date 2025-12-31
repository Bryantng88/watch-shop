import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateNestedManyWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  defaultPrice: z.number().optional().nullable(),
  durationMin: z.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  detail: ServiceDetailSchema,
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateWithoutMaintenanceRecordInput>;
export const ServiceCatalogCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
