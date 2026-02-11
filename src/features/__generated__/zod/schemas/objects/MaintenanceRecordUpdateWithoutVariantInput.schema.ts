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
import { MaintenancePartUpdateManyWithoutRecordNestedInputObjectSchema as MaintenancePartUpdateManyWithoutRecordNestedInputObjectSchema } from './MaintenancePartUpdateManyWithoutRecordNestedInput.schema';
import { ProductUpdateOneWithoutMaintenanceRecordsNestedInputObjectSchema as ProductUpdateOneWithoutMaintenanceRecordsNestedInputObjectSchema } from './ProductUpdateOneWithoutMaintenanceRecordsNestedInput.schema';
import { ServiceRequestUpdateOneWithoutMaintenanceNestedInputObjectSchema as ServiceRequestUpdateOneWithoutMaintenanceNestedInputObjectSchema } from './ServiceRequestUpdateOneWithoutMaintenanceNestedInput.schema';
import { VendorUpdateOneWithoutServicesNestedInputObjectSchema as VendorUpdateOneWithoutServicesNestedInputObjectSchema } from './VendorUpdateOneWithoutServicesNestedInput.schema';
import { ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema as ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema } from './ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInput.schema'

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
  parts: z.lazy(() => MaintenancePartUpdateManyWithoutRecordNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutMaintenanceRecordsNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateOneWithoutMaintenanceNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutServicesNestedInputObjectSchema).optional(),
  serviceDetail: z.lazy(() => ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUpdateWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithoutVariantInput>;
export const MaintenanceRecordUpdateWithoutVariantInputObjectZodSchema = makeSchema();
