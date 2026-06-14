import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedCreateNestedManyWithoutServiceCatalogInput.schema'

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
  orderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  taskAction: z.lazy(() => TaskActionUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput>;
export const ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
