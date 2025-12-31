import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInput.schema'

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
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput>;
export const ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
