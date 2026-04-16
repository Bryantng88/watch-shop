import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { EnumServiceTypeFieldUpdateOperationsInputObjectSchema as EnumServiceTypeFieldUpdateOperationsInputObjectSchema } from './EnumServiceTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { EnumServiceRequestStatusFieldUpdateOperationsInputObjectSchema as EnumServiceRequestStatusFieldUpdateOperationsInputObjectSchema } from './EnumServiceRequestStatusFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema as NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema } from './NullableEnumServiceScopeFieldUpdateOperationsInput.schema';
import { InvoiceUpdateManyWithoutServiceRequestNestedInputObjectSchema as InvoiceUpdateManyWithoutServiceRequestNestedInputObjectSchema } from './InvoiceUpdateManyWithoutServiceRequestNestedInput.schema';
import { CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema as CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './CustomerUpdateOneWithoutServiceRequestNestedInput.schema';
import { OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema as OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './OrderItemUpdateOneWithoutServiceRequestNestedInput.schema';
import { ProductUpdateOneWithoutServiceRequestNestedInputObjectSchema as ProductUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './ProductUpdateOneWithoutServiceRequestNestedInput.schema';
import { UserUpdateOneWithoutServiceRequestNestedInputObjectSchema as UserUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './UserUpdateOneWithoutServiceRequestNestedInput.schema';
import { ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema as ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutServiceRequestNestedInput.schema';
import { VendorUpdateOneWithoutServiceRequestNestedInputObjectSchema as VendorUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './VendorUpdateOneWithoutServiceRequestNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutServiceRequestNestedInput.schema';
import { TechnicalAssessmentUpdateOneWithoutServiceRequestNestedInputObjectSchema as TechnicalAssessmentUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './TechnicalAssessmentUpdateOneWithoutServiceRequestNestedInput.schema';
import { TechnicalIssueUpdateManyWithoutServiceRequestNestedInputObjectSchema as TechnicalIssueUpdateManyWithoutServiceRequestNestedInputObjectSchema } from './TechnicalIssueUpdateManyWithoutServiceRequestNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([ServiceTypeSchema, z.lazy(() => EnumServiceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  billable: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  modelSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  refSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serialSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  appointmentAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([ServiceRequestStatusSchema, z.lazy(() => EnumServiceRequestStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  warrantyUntil: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  warrantyPolicy: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scope: z.union([ServiceScopeSchema, z.lazy(() => NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  technicianNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  skuSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  primaryImageUrlSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dummy_technical_rel: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priority: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priority_reason: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priority_source: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priority_marked_at: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priorityReason: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  prioritySource: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  priorityMarkedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  invoice: z.lazy(() => InvoiceUpdateManyWithoutServiceRequestNestedInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  productVariant: z.lazy(() => ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  technicalAssessment: z.lazy(() => TechnicalAssessmentUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUpdateManyWithoutServiceRequestNestedInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpdateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithoutMaintenanceRecordInput>;
export const ServiceRequestUpdateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
