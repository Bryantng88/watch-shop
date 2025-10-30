import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { EnumContentStatusFieldUpdateOperationsInputObjectSchema as EnumContentStatusFieldUpdateOperationsInputObjectSchema } from './EnumContentStatusFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumProductTypeFieldUpdateOperationsInputObjectSchema as EnumProductTypeFieldUpdateOperationsInputObjectSchema } from './EnumProductTypeFieldUpdateOperationsInput.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { EnumPriceVisibilityFieldUpdateOperationsInputObjectSchema as EnumPriceVisibilityFieldUpdateOperationsInputObjectSchema } from './EnumPriceVisibilityFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TagSchema } from '../enums/Tag.schema';
import { EnumTagFieldUpdateOperationsInputObjectSchema as EnumTagFieldUpdateOperationsInputObjectSchema } from './EnumTagFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutProductNestedInput.schema';
import { InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema as InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema } from './InvoiceItemUpdateManyWithoutProductNestedInput.schema';
import { MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutProductNestedInput.schema';
import { OrderItemUpdateManyWithoutProductNestedInputObjectSchema as OrderItemUpdateManyWithoutProductNestedInputObjectSchema } from './OrderItemUpdateManyWithoutProductNestedInput.schema';
import { BrandUpdateOneWithoutProductsNestedInputObjectSchema as BrandUpdateOneWithoutProductsNestedInputObjectSchema } from './BrandUpdateOneWithoutProductsNestedInput.schema';
import { VendorUpdateOneWithoutProductNestedInputObjectSchema as VendorUpdateOneWithoutProductNestedInputObjectSchema } from './VendorUpdateOneWithoutProductNestedInput.schema';
import { ProductImageUpdateManyWithoutProductNestedInputObjectSchema as ProductImageUpdateManyWithoutProductNestedInputObjectSchema } from './ProductImageUpdateManyWithoutProductNestedInput.schema';
import { ProductVariantUpdateManyWithoutProductNestedInputObjectSchema as ProductVariantUpdateManyWithoutProductNestedInputObjectSchema } from './ProductVariantUpdateManyWithoutProductNestedInput.schema';
import { ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema as ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutProductNestedInput.schema';
import { WatchSpecUpdateOneWithoutProductNestedInputObjectSchema as WatchSpecUpdateOneWithoutProductNestedInputObjectSchema } from './WatchSpecUpdateOneWithoutProductNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  primaryImageUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  contentStatus: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([ProductTypeSchema, z.lazy(() => EnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  priceVisibility: z.union([PriceVisibilitySchema, z.lazy(() => EnumPriceVisibilityFieldUpdateOperationsInputObjectSchema)]).optional(),
  seoTitle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seoDescription: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isStockManaged: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  publishedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tag: z.union([TagSchema, z.lazy(() => EnumTagFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  brand: z.lazy(() => BrandUpdateOneWithoutProductsNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUpdateOneWithoutProductNestedInputObjectSchema).optional()
}).strict();
export const ProductUpdateWithoutReservationInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithoutReservationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithoutReservationInput>;
export const ProductUpdateWithoutReservationInputObjectZodSchema = makeSchema();
