import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemCreateNestedManyWithoutProductInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutProductInput.schema';
import { OrderItemCreateNestedManyWithoutProductInputObjectSchema as OrderItemCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemCreateNestedManyWithoutProductInput.schema';
import { BrandCreateNestedOneWithoutProductsInputObjectSchema as BrandCreateNestedOneWithoutProductsInputObjectSchema } from './BrandCreateNestedOneWithoutProductsInput.schema';
import { VendorCreateNestedOneWithoutProductInputObjectSchema as VendorCreateNestedOneWithoutProductInputObjectSchema } from './VendorCreateNestedOneWithoutProductInput.schema';
import { ProductVariantCreateNestedManyWithoutProductInputObjectSchema as ProductVariantCreateNestedManyWithoutProductInputObjectSchema } from './ProductVariantCreateNestedManyWithoutProductInput.schema';
import { ReservationCreateNestedManyWithoutProductInputObjectSchema as ReservationCreateNestedManyWithoutProductInputObjectSchema } from './ReservationCreateNestedManyWithoutProductInput.schema';
import { ServiceRequestCreateNestedManyWithoutProductInputObjectSchema as ServiceRequestCreateNestedManyWithoutProductInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutProductInput.schema';
import { WatchSpecCreateNestedOneWithoutProductInputObjectSchema as WatchSpecCreateNestedOneWithoutProductInputObjectSchema } from './WatchSpecCreateNestedOneWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  contentStatus: ContentStatusSchema.optional(),
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
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  brand: z.lazy(() => BrandCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutProductInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantCreateNestedManyWithoutProductInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationCreateNestedManyWithoutProductInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutProductInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutImageInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutImageInput>;
export const ProductCreateWithoutImageInputObjectZodSchema = makeSchema();
