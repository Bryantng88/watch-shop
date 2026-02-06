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
import { InvoiceUpdateManyWithoutServiceReqNestedInputObjectSchema as InvoiceUpdateManyWithoutServiceReqNestedInputObjectSchema } from './InvoiceUpdateManyWithoutServiceReqNestedInput.schema';
import { MaintenanceRecordUpdateManyWithoutServiceRequestNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutServiceRequestNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutServiceRequestNestedInput.schema';
import { CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema as CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './CustomerUpdateOneWithoutServiceRequestNestedInput.schema';
import { OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema as OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './OrderItemUpdateOneWithoutServiceRequestNestedInput.schema';
import { ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema as ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutServiceRequestNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutServiceRequestNestedInput.schema'

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
  Invoice: z.lazy(() => InvoiceUpdateManyWithoutServiceReqNestedInputObjectSchema).optional(),
  maintenance: z.lazy(() => MaintenanceRecordUpdateManyWithoutServiceRequestNestedInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithoutProductInput>;
export const ServiceRequestUpdateWithoutProductInputObjectZodSchema = makeSchema();
