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
import { OrderItemListRelationFilterObjectSchema as OrderItemListRelationFilterObjectSchema } from './OrderItemListRelationFilter.schema';
import { MaintenanceRecordNullableScalarRelationFilterObjectSchema as MaintenanceRecordNullableScalarRelationFilterObjectSchema } from './MaintenanceRecordNullableScalarRelationFilter.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema'

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
  maintenanceRecordId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  detail: z.union([z.lazy(() => EnumServiceDetailFilterObjectSchema), ServiceDetailSchema]).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterObjectSchema).optional(),
  maintenanceRecord: z.union([z.lazy(() => MaintenanceRecordNullableScalarRelationFilterObjectSchema), z.lazy(() => MaintenanceRecordWhereInputObjectSchema)]).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional()
}).strict();
export const ServiceCatalogWhereInputObjectSchema: z.ZodType<Prisma.ServiceCatalogWhereInput> = servicecatalogwhereinputSchema as unknown as z.ZodType<Prisma.ServiceCatalogWhereInput>;
export const ServiceCatalogWhereInputObjectZodSchema = servicecatalogwhereinputSchema;
