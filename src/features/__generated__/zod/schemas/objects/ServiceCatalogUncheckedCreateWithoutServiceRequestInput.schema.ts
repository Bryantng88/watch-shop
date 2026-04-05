import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInput.schema'

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
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedCreateWithoutServiceRequestInput>;
export const ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
