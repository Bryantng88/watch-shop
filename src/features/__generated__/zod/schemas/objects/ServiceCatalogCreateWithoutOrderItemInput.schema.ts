import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
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
  updatedAt: z.coerce.date().optional(),
  detail: ServiceDetailSchema,
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateWithoutOrderItemInput>;
export const ServiceCatalogCreateWithoutOrderItemInputObjectZodSchema = makeSchema();
