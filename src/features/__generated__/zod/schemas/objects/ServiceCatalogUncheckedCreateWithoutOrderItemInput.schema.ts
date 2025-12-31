import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
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
  maintenanceRecordId: z.string().optional().nullable(),
  detail: ServiceDetailSchema,
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutOrderItemInput>;
export const ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectZodSchema = makeSchema();
