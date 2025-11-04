import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema as NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { EnumAvailabilityStatusFieldUpdateOperationsInputObjectSchema as EnumAvailabilityStatusFieldUpdateOperationsInputObjectSchema } from './EnumAvailabilityStatusFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema as StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema } from './StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sku: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  price: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  stockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  isStockManaged: z.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  availabilityStatus: z.union([AvailabilityStatusSchema, z.lazy(() => EnumAvailabilityStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  invoiceItem: z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  maintenancePart: z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedUpdateWithoutPartSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedUpdateWithoutPartSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedUpdateWithoutPartSpecInput>;
export const ProductVariantUncheckedUpdateWithoutPartSpecInputObjectZodSchema = makeSchema();
