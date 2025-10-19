import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema as NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInput.schema';
import { PartVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema as PartVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema } from './PartVariantSpecUncheckedUpdateOneWithoutVariantNestedInput.schema';
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
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecUncheckedUpdateOneWithoutVariantNestedInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedUpdateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedUpdateWithoutAcquisitionItemInput>;
export const ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
