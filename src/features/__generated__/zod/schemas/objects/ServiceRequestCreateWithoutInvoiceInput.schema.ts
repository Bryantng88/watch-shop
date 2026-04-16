import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutServiceRequestInput.schema';
import { CustomerCreateNestedOneWithoutServiceRequestInputObjectSchema as CustomerCreateNestedOneWithoutServiceRequestInputObjectSchema } from './CustomerCreateNestedOneWithoutServiceRequestInput.schema';
import { OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema as OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema } from './OrderItemCreateNestedOneWithoutServiceRequestInput.schema';
import { ProductCreateNestedOneWithoutServiceRequestInputObjectSchema as ProductCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ProductCreateNestedOneWithoutServiceRequestInput.schema';
import { UserCreateNestedOneWithoutServiceRequestInputObjectSchema as UserCreateNestedOneWithoutServiceRequestInputObjectSchema } from './UserCreateNestedOneWithoutServiceRequestInput.schema';
import { ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema as ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateNestedOneWithoutServiceRequestInput.schema';
import { VendorCreateNestedOneWithoutServiceRequestInputObjectSchema as VendorCreateNestedOneWithoutServiceRequestInputObjectSchema } from './VendorCreateNestedOneWithoutServiceRequestInput.schema';
import { ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutServiceRequestInput.schema';
import { TechnicalAssessmentCreateNestedOneWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateNestedOneWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateNestedOneWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateNestedManyWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateNestedManyWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  brandSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  serialSnapshot: z.string().optional().nullable(),
  appointmentAt: z.coerce.date().optional().nullable(),
  status: ServiceRequestStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  warrantyPolicy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  refNo: z.string().optional().nullable(),
  scope: ServiceScopeSchema.optional().nullable(),
  vendorNameSnap: z.string().optional().nullable(),
  technicianNameSnap: z.string().optional().nullable(),
  skuSnapshot: z.string().optional().nullable(),
  primaryImageUrlSnapshot: z.string().optional().nullable(),
  dummy_technical_rel: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  priority_reason: z.string().optional().nullable(),
  priority_source: z.string().optional().nullable(),
  priority_marked_at: z.coerce.date().optional().nullable(),
  priorityReason: z.string().optional().nullable(),
  prioritySource: z.string().optional().nullable(),
  priorityMarkedAt: z.coerce.date().optional().nullable(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  productVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  technicalAssessment: z.lazy(() => TechnicalAssessmentCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutServiceRequestInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateWithoutInvoiceInput>;
export const ServiceRequestCreateWithoutInvoiceInputObjectZodSchema = makeSchema();
