import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumServiceTypeFilterObjectSchema as EnumServiceTypeFilterObjectSchema } from './EnumServiceTypeFilter.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumServiceRequestStatusFilterObjectSchema as EnumServiceRequestStatusFilterObjectSchema } from './EnumServiceRequestStatusFilter.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumServiceScopeNullableFilterObjectSchema as EnumServiceScopeNullableFilterObjectSchema } from './EnumServiceScopeNullableFilter.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { InvoiceListRelationFilterObjectSchema as InvoiceListRelationFilterObjectSchema } from './InvoiceListRelationFilter.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { CustomerNullableScalarRelationFilterObjectSchema as CustomerNullableScalarRelationFilterObjectSchema } from './CustomerNullableScalarRelationFilter.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { OrderItemNullableScalarRelationFilterObjectSchema as OrderItemNullableScalarRelationFilterObjectSchema } from './OrderItemNullableScalarRelationFilter.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductVariantNullableScalarRelationFilterObjectSchema as ProductVariantNullableScalarRelationFilterObjectSchema } from './ProductVariantNullableScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ServiceCatalogNullableScalarRelationFilterObjectSchema as ServiceCatalogNullableScalarRelationFilterObjectSchema } from './ServiceCatalogNullableScalarRelationFilter.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const servicerequestwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceRequestWhereInputObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceRequestWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceRequestWhereInputObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumServiceTypeFilterObjectSchema), ServiceTypeSchema]).optional(),
  billable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  orderItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serialSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  appointmentAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumServiceRequestStatusFilterObjectSchema), ServiceRequestStatusSchema]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  warrantyPolicy: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  servicecatalogid: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumServiceScopeNullableFilterObjectSchema), ServiceScopeSchema]).optional().nullable(),
  Invoice: z.lazy(() => InvoiceListRelationFilterObjectSchema).optional(),
  maintenance: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  customer: z.union([z.lazy(() => CustomerNullableScalarRelationFilterObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  orderItem: z.union([z.lazy(() => OrderItemNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  variant: z.union([z.lazy(() => ProductVariantNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.lazy(() => ServiceCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestWhereInputObjectSchema: z.ZodType<Prisma.ServiceRequestWhereInput> = servicerequestwhereinputSchema as unknown as z.ZodType<Prisma.ServiceRequestWhereInput>;
export const ServiceRequestWhereInputObjectZodSchema = servicerequestwhereinputSchema;
