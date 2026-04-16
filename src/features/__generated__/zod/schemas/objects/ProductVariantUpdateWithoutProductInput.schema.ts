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
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema as NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumDiscountTypeFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateManyWithoutProductVariantNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutProductVariantNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutProductVariantNestedInput.schema';
import { InvoiceItemUpdateManyWithoutProductVariantNestedInputObjectSchema as InvoiceItemUpdateManyWithoutProductVariantNestedInputObjectSchema } from './InvoiceItemUpdateManyWithoutProductVariantNestedInput.schema';
import { MaintenancePartUpdateManyWithoutProductVariantNestedInputObjectSchema as MaintenancePartUpdateManyWithoutProductVariantNestedInputObjectSchema } from './MaintenancePartUpdateManyWithoutProductVariantNestedInput.schema';
import { MaintenanceRecordUpdateManyWithoutProductVariantNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutProductVariantNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutProductVariantNestedInput.schema';
import { PartVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema as PartVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema } from './PartVariantSpecUpdateOneWithoutProductVariantNestedInput.schema';
import { ServiceRequestUpdateManyWithoutProductVariantNestedInputObjectSchema as ServiceRequestUpdateManyWithoutProductVariantNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutProductVariantNestedInput.schema';
import { StrapVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema as StrapVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema } from './StrapVariantSpecUpdateOneWithoutProductVariantNestedInput.schema'

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
  listPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  discountType: z.union([DiscountTypeSchema, z.lazy(() => NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  discountValue: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  salePrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  saleStartsAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  saleEndsAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  costPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutProductVariantNestedInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUpdateManyWithoutProductVariantNestedInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUpdateManyWithoutProductVariantNestedInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUpdateManyWithoutProductVariantNestedInputObjectSchema).optional(),
  PartVariantSpec: z.lazy(() => PartVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutProductVariantNestedInputObjectSchema).optional(),
  StrapVariantSpec: z.lazy(() => StrapVariantSpecUpdateOneWithoutProductVariantNestedInputObjectSchema).optional()
}).strict();
export const ProductVariantUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateWithoutProductInput>;
export const ProductVariantUpdateWithoutProductInputObjectZodSchema = makeSchema();
