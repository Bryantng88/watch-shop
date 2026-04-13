import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutProductInput.schema';
import { AcquisitionSpecJobCreateNestedManyWithoutProductInputObjectSchema as AcquisitionSpecJobCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemCreateNestedManyWithoutProductInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutProductInput.schema';
import { OrderItemCreateNestedManyWithoutProductInputObjectSchema as OrderItemCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemCreateNestedManyWithoutProductInput.schema';
import { ProductCategoryCreateNestedOneWithoutProductInputObjectSchema as ProductCategoryCreateNestedOneWithoutProductInputObjectSchema } from './ProductCategoryCreateNestedOneWithoutProductInput.schema';
import { VendorCreateNestedOneWithoutProductInputObjectSchema as VendorCreateNestedOneWithoutProductInputObjectSchema } from './VendorCreateNestedOneWithoutProductInput.schema';
import { ProductContentCreateNestedOneWithoutProductInputObjectSchema as ProductContentCreateNestedOneWithoutProductInputObjectSchema } from './ProductContentCreateNestedOneWithoutProductInput.schema';
import { ProductImageCreateNestedManyWithoutProductInputObjectSchema as ProductImageCreateNestedManyWithoutProductInputObjectSchema } from './ProductImageCreateNestedManyWithoutProductInput.schema';
import { ProductVariantCreateNestedManyWithoutProductInputObjectSchema as ProductVariantCreateNestedManyWithoutProductInputObjectSchema } from './ProductVariantCreateNestedManyWithoutProductInput.schema';
import { ReservationCreateNestedManyWithoutProductInputObjectSchema as ReservationCreateNestedManyWithoutProductInputObjectSchema } from './ReservationCreateNestedManyWithoutProductInput.schema';
import { ServiceRequestCreateNestedManyWithoutProductInputObjectSchema as ServiceRequestCreateNestedManyWithoutProductInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutProductInput.schema';
import { WatchSpecCreateNestedOneWithoutProductInputObjectSchema as WatchSpecCreateNestedOneWithoutProductInputObjectSchema } from './WatchSpecCreateNestedOneWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  type: ProductTypeSchema,
  priceVisibility: PriceVisibilitySchema.optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: TagSchema.optional(),
  status: ProductStatusSchema.optional(),
  contentStatus: ContentStatusSchema.optional(),
  postContent: z.string().optional().nullable(),
  aiPromptUsed: z.string().optional().nullable(),
  aiGeneratedAt: z.coerce.date().optional().nullable(),
  sku: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  specStatus: z.string().optional(),
  storefrontImageKey: z.string().optional().nullable(),
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  AcquisitionSpecJob: z.lazy(() => AcquisitionSpecJobCreateNestedManyWithoutProductInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  ProductCategory: z.lazy(() => ProductCategoryCreateNestedOneWithoutProductInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutProductInputObjectSchema).optional(),
  content: z.lazy(() => ProductContentCreateNestedOneWithoutProductInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageCreateNestedManyWithoutProductInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantCreateNestedManyWithoutProductInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationCreateNestedManyWithoutProductInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutProductInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutBrandInput>;
export const ProductCreateWithoutBrandInputObjectZodSchema = makeSchema();
