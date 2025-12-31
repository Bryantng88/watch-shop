import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateNestedManyWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutServiceDetailInput.schema';
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
  detail: ServiceDetailSchema,
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema)
}).strict();
export const ServiceCatalogCreateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateInput>;
export const ServiceCatalogCreateInputObjectZodSchema = makeSchema();
