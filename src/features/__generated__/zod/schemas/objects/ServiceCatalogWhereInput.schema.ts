import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumServiceDetailFilterObjectSchema as EnumServiceDetailFilterObjectSchema } from './EnumServiceDetailFilter.schema';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { OrderItemListRelationFilterObjectSchema as OrderItemListRelationFilterObjectSchema } from './OrderItemListRelationFilter.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema';
import { TechnicalIssueListRelationFilterObjectSchema as TechnicalIssueListRelationFilterObjectSchema } from './TechnicalIssueListRelationFilter.schema'

const servicecatalogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceCatalogWhereInputObjectSchema), z.lazy(() => ServiceCatalogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceCatalogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceCatalogWhereInputObjectSchema), z.lazy(() => ServiceCatalogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  defaultPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  durationMin: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  detail: z.union([z.lazy(() => EnumServiceDetailFilterObjectSchema), ServiceDetailSchema]).optional(),
  vendorPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  customerPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  internalCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  categoryKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueListRelationFilterObjectSchema).optional()
}).strict();
export const ServiceCatalogWhereInputObjectSchema: z.ZodType<Prisma.ServiceCatalogWhereInput> = servicecatalogwhereinputSchema as unknown as z.ZodType<Prisma.ServiceCatalogWhereInput>;
export const ServiceCatalogWhereInputObjectZodSchema = servicecatalogwhereinputSchema;
