import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutServiceDetailInput.schema';
import { ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutServiceCatalogInput.schema'

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
  vendorPrice: z.number().optional().nullable(),
  customerPrice: z.number().optional().nullable(),
  internalCost: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  categoryKey: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateWithoutOrderItemInput>;
export const ServiceCatalogCreateWithoutOrderItemInputObjectZodSchema = makeSchema();
