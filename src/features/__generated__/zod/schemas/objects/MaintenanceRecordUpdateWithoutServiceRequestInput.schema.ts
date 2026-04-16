import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { EnumServiceTypeFieldUpdateOperationsInputObjectSchema as EnumServiceTypeFieldUpdateOperationsInputObjectSchema } from './EnumServiceTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { EnumMaintenanceEventTypeFieldUpdateOperationsInputObjectSchema as EnumMaintenanceEventTypeFieldUpdateOperationsInputObjectSchema } from './EnumMaintenanceEventTypeFieldUpdateOperationsInput.schema';
import { MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema as MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema } from './MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInput.schema';
import { PaymentUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as PaymentUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './PaymentUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { ProductUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as ProductUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './ProductUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { UserUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as UserUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './UserUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { ProductVariantUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as ProductVariantUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutMaintenanceRecordNestedInput.schema';
import { VendorUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema as VendorUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema } from './VendorUpdateOneWithoutMaintenanceRecordNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([ServiceTypeSchema, z.lazy(() => EnumServiceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  billable: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  modelSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  refSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serialSnapshot: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  servicedByName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  servicedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  totalCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  billed: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  invoiceId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  revenueAmount: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  currency: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventType: z.union([MaintenanceEventTypeSchema, z.lazy(() => EnumMaintenanceEventTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  prevVendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  prevVendorName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  paidAmount: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  paidAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  technicianNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  diagnosis: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workSummary: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  processingMode: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  imageFileKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  MaintenancePart: z.lazy(() => MaintenancePartUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  User: z.lazy(() => UserUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  ProductVariant: z.lazy(() => ProductVariantUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithoutServiceRequestInput>;
export const MaintenanceRecordUpdateWithoutServiceRequestInputObjectZodSchema = makeSchema();
