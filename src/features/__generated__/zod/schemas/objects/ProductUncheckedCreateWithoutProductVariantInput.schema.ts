import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedCreateNestedManyWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutProductInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { ProductContentUncheckedCreateNestedOneWithoutProductInputObjectSchema as ProductContentUncheckedCreateNestedOneWithoutProductInputObjectSchema } from './ProductContentUncheckedCreateNestedOneWithoutProductInput.schema';
import { ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema as ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateNestedManyWithoutProductInput.schema';
import { ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema as ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ReservationUncheckedCreateNestedManyWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutProductInput.schema';
import { WatchUncheckedCreateNestedOneWithoutProductInputObjectSchema as WatchUncheckedCreateNestedOneWithoutProductInputObjectSchema } from './WatchUncheckedCreateNestedOneWithoutProductInput.schema';
import { WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema as WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateNestedOneWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  type: ProductTypeSchema,
  priceVisibility: PriceVisibilitySchema.optional(),
  brandId: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: TagSchema.optional(),
  status: ProductStatusSchema.optional(),
  categoryId: z.string().optional().nullable(),
  contentStatus: ContentStatusSchema.optional(),
  postContent: z.string().optional().nullable(),
  aiPromptUsed: z.string().optional().nullable(),
  aiGeneratedAt: z.coerce.date().optional().nullable(),
  sku: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  specStatus: z.string().optional(),
  storefrontImageKey: z.string().optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  acquisitionSpecJob: z.lazy(() => AcquisitionSpecJobUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  invoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  productContent: z.lazy(() => ProductContentUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional(),
  productImage: z.lazy(() => ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  reservation: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  watch: z.lazy(() => WatchUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutProductVariantInput>;
export const ProductUncheckedCreateWithoutProductVariantInputObjectZodSchema = makeSchema();
