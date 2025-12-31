import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateNestedManyWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutServiceDetailInput.schema'

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
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateWithoutServiceRequestInput>;
export const ServiceCatalogCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
