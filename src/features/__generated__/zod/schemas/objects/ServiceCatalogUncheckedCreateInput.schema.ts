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
  maintenanceRecordId: z.string().optional().nullable(),
  detail: ServiceDetailSchema,
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema)
}).strict();
export const ServiceCatalogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedCreateInput>;
export const ServiceCatalogUncheckedCreateInputObjectZodSchema = makeSchema();
