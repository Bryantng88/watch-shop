import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { EnumContentStatusFieldUpdateOperationsInputObjectSchema as EnumContentStatusFieldUpdateOperationsInputObjectSchema } from './EnumContentStatusFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumProductTypeFieldUpdateOperationsInputObjectSchema as EnumProductTypeFieldUpdateOperationsInputObjectSchema } from './EnumProductTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TagSchema } from '../enums/Tag.schema';
import { EnumTagFieldUpdateOperationsInputObjectSchema as EnumTagFieldUpdateOperationsInputObjectSchema } from './EnumTagFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutProductNestedInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutProductNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInput.schema';
import { ProductImageUncheckedUpdateManyWithoutProductNestedInputObjectSchema as ProductImageUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './ProductImageUncheckedUpdateManyWithoutProductNestedInput.schema';
import { ProductVariantUncheckedUpdateManyWithoutProductNestedInputObjectSchema as ProductVariantUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './ProductVariantUncheckedUpdateManyWithoutProductNestedInput.schema';
import { ReservationUncheckedUpdateManyWithoutProductNestedInputObjectSchema as ReservationUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './ReservationUncheckedUpdateManyWithoutProductNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutProductNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutProductNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutProductNestedInput.schema';
import { WatchSpecUncheckedUpdateOneWithoutProductNestedInputObjectSchema as WatchSpecUncheckedUpdateOneWithoutProductNestedInputObjectSchema } from './WatchSpecUncheckedUpdateOneWithoutProductNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  primaryImageUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  contentStatus: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([ProductTypeSchema, z.lazy(() => EnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seoTitle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seoDescription: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isStockManaged: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  publishedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tag: z.union([TagSchema, z.lazy(() => EnumTagFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUncheckedUpdateOneWithoutProductNestedInputObjectSchema).optional()
}).strict();
export const ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedUpdateWithoutOrderItemsInput>;
export const ProductUncheckedUpdateWithoutOrderItemsInputObjectZodSchema = makeSchema();
