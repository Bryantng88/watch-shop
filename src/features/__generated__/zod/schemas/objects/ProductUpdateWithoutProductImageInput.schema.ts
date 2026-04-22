import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
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
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { EnumProductStatusFieldUpdateOperationsInputObjectSchema as EnumProductStatusFieldUpdateOperationsInputObjectSchema } from './EnumProductStatusFieldUpdateOperationsInput.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { EnumContentStatusFieldUpdateOperationsInputObjectSchema as EnumContentStatusFieldUpdateOperationsInputObjectSchema } from './EnumContentStatusFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutProductNestedInput.schema';
import { AcquisitionSpecJobUpdateManyWithoutProductNestedInputObjectSchema as AcquisitionSpecJobUpdateManyWithoutProductNestedInputObjectSchema } from './AcquisitionSpecJobUpdateManyWithoutProductNestedInput.schema';
import { InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema as InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema } from './InvoiceItemUpdateManyWithoutProductNestedInput.schema';
import { MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutProductNestedInput.schema';
import { OrderItemUpdateManyWithoutProductNestedInputObjectSchema as OrderItemUpdateManyWithoutProductNestedInputObjectSchema } from './OrderItemUpdateManyWithoutProductNestedInput.schema';
import { BrandUpdateOneWithoutProductNestedInputObjectSchema as BrandUpdateOneWithoutProductNestedInputObjectSchema } from './BrandUpdateOneWithoutProductNestedInput.schema';
import { ProductCategoryUpdateOneWithoutProductNestedInputObjectSchema as ProductCategoryUpdateOneWithoutProductNestedInputObjectSchema } from './ProductCategoryUpdateOneWithoutProductNestedInput.schema';
import { VendorUpdateOneWithoutProductNestedInputObjectSchema as VendorUpdateOneWithoutProductNestedInputObjectSchema } from './VendorUpdateOneWithoutProductNestedInput.schema';
import { ProductContentUpdateOneWithoutProductNestedInputObjectSchema as ProductContentUpdateOneWithoutProductNestedInputObjectSchema } from './ProductContentUpdateOneWithoutProductNestedInput.schema';
import { ProductVariantUpdateManyWithoutProductNestedInputObjectSchema as ProductVariantUpdateManyWithoutProductNestedInputObjectSchema } from './ProductVariantUpdateManyWithoutProductNestedInput.schema';
import { ReservationUpdateManyWithoutProductNestedInputObjectSchema as ReservationUpdateManyWithoutProductNestedInputObjectSchema } from './ReservationUpdateManyWithoutProductNestedInput.schema';
import { ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema as ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutProductNestedInput.schema';
import { WatchUpdateOneWithoutProductNestedInputObjectSchema as WatchUpdateOneWithoutProductNestedInputObjectSchema } from './WatchUpdateOneWithoutProductNestedInput.schema';
import { WatchSpecUpdateOneWithoutProductNestedInputObjectSchema as WatchSpecUpdateOneWithoutProductNestedInputObjectSchema } from './WatchSpecUpdateOneWithoutProductNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  primaryImageUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
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
  status: z.union([ProductStatusSchema, z.lazy(() => EnumProductStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  contentStatus: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  postContent: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  aiPromptUsed: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  aiGeneratedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sku: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  nickname: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  specStatus: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  storefrontImageKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  acquisitionSpecJob: z.lazy(() => AcquisitionSpecJobUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  invoiceItem: z.lazy(() => InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  brand: z.lazy(() => BrandUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  productCategory: z.lazy(() => ProductCategoryUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  productContent: z.lazy(() => ProductContentUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  productVariant: z.lazy(() => ProductVariantUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  reservation: z.lazy(() => ReservationUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  watch: z.lazy(() => WatchUpdateOneWithoutProductNestedInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUpdateOneWithoutProductNestedInputObjectSchema).optional()
}).strict();
export const ProductUpdateWithoutProductImageInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithoutProductImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithoutProductImageInput>;
export const ProductUpdateWithoutProductImageInputObjectZodSchema = makeSchema();
