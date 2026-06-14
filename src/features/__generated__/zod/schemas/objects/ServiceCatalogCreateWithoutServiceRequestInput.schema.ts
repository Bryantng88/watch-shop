import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { MaintenanceRecordCreateNestedManyWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutServiceCatalogInput.schema';
import { OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemCreateNestedManyWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutServiceCatalogInput.schema';
import { TaskActionCreateNestedManyWithoutServiceCatalogInputObjectSchema as TaskActionCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateNestedManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  defaultPrice: z.number().optional().nullable(),
  durationMin: z.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  detail: ServiceDetailSchema,
  vendorPrice: z.number().optional().nullable(),
  customerPrice: z.number().optional().nullable(),
  internalCost: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  categoryKey: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  taskAction: z.lazy(() => TaskActionCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateWithoutServiceRequestInput>;
export const ServiceCatalogCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
