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
import { AcquisitionItemUpdateManyWithoutVariantNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutVariantNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutVariantNestedInput.schema';
import { MaintenancePartUpdateManyWithoutVariantNestedInputObjectSchema as MaintenancePartUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenancePartUpdateManyWithoutVariantNestedInput.schema';
import { MaintenanceRecordUpdateManyWithoutVariantNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutVariantNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutVariantNestedInput.schema';
import { PartVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema as PartVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema } from './PartVariantSpecUpdateOneWithoutVariantNestedInput.schema';
import { ProductUpdateOneRequiredWithoutVariantsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutVariantsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutVariantsNestedInput.schema';
import { ServiceRequestUpdateManyWithoutVariantNestedInputObjectSchema as ServiceRequestUpdateManyWithoutVariantNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutVariantNestedInput.schema';
import { StrapVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema as StrapVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema } from './StrapVariantSpecUpdateOneWithoutVariantNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sku: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  price: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  stockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  isStockManaged: z.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  availabilityStatus: z.union([AvailabilityStatusSchema, z.lazy(() => EnumAvailabilityStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutVariantsNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutVariantNestedInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecUpdateOneWithoutVariantNestedInputObjectSchema).optional()
}).strict();
export const ProductVariantUpdateWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateWithoutInvoiceItemInput>;
export const ProductVariantUpdateWithoutInvoiceItemInputObjectZodSchema = makeSchema();
