import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumServiceTypeFilterObjectSchema as EnumServiceTypeFilterObjectSchema } from './EnumServiceTypeFilter.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumMaintenanceEventTypeFilterObjectSchema as EnumMaintenanceEventTypeFilterObjectSchema } from './EnumMaintenanceEventTypeFilter.schema';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { MaintenancePartListRelationFilterObjectSchema as MaintenancePartListRelationFilterObjectSchema } from './MaintenancePartListRelationFilter.schema';
import { PaymentNullableScalarRelationFilterObjectSchema as PaymentNullableScalarRelationFilterObjectSchema } from './PaymentNullableScalarRelationFilter.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ServiceCatalogNullableScalarRelationFilterObjectSchema as ServiceCatalogNullableScalarRelationFilterObjectSchema } from './ServiceCatalogNullableScalarRelationFilter.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceRequestNullableScalarRelationFilterObjectSchema as ServiceRequestNullableScalarRelationFilterObjectSchema } from './ServiceRequestNullableScalarRelationFilter.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { TechnicalIssueNullableScalarRelationFilterObjectSchema as TechnicalIssueNullableScalarRelationFilterObjectSchema } from './TechnicalIssueNullableScalarRelationFilter.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { ProductVariantNullableScalarRelationFilterObjectSchema as ProductVariantNullableScalarRelationFilterObjectSchema } from './ProductVariantNullableScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { VendorNullableScalarRelationFilterObjectSchema as VendorNullableScalarRelationFilterObjectSchema } from './VendorNullableScalarRelationFilter.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const maintenancerecordwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MaintenanceRecordWhereInputObjectSchema), z.lazy(() => MaintenanceRecordWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MaintenanceRecordWhereInputObjectSchema), z.lazy(() => MaintenanceRecordWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumServiceTypeFilterObjectSchema), ServiceTypeSchema]).optional(),
  billable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serialSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  servicedByName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  servicedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  totalCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  billed: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  invoiceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  revenueAmount: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  eventType: z.union([z.lazy(() => EnumMaintenanceEventTypeFilterObjectSchema), MaintenanceEventTypeSchema]).optional(),
  prevVendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  prevVendorName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  paymentId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  paidAmount: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  paidAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  technicianId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicianNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  diagnosis: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workSummary: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  processingMode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  imageFileKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  MaintenancePart: z.lazy(() => MaintenancePartListRelationFilterObjectSchema).optional(),
  Payment: z.union([z.lazy(() => PaymentNullableScalarRelationFilterObjectSchema), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  Product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  serviceCatalog: z.union([z.lazy(() => ServiceCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  ServiceRequest: z.union([z.lazy(() => ServiceRequestNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  TechnicalIssue: z.union([z.lazy(() => TechnicalIssueNullableScalarRelationFilterObjectSchema), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  User: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  ProductVariant: z.union([z.lazy(() => ProductVariantNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  Vendor: z.union([z.lazy(() => VendorNullableScalarRelationFilterObjectSchema), z.lazy(() => VendorWhereInputObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordWhereInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordWhereInput> = maintenancerecordwhereinputSchema as unknown as z.ZodType<Prisma.MaintenanceRecordWhereInput>;
export const MaintenanceRecordWhereInputObjectZodSchema = maintenancerecordwhereinputSchema;
