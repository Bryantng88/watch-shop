import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { InvoiceItemFindManySchema as InvoiceItemFindManySchema } from '../findManyInvoiceItem.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { BrandArgsObjectSchema as BrandArgsObjectSchema } from './BrandArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { ProductImageFindManySchema as ProductImageFindManySchema } from '../findManyProductImage.schema';
import { ProductVariantFindManySchema as ProductVariantFindManySchema } from '../findManyProductVariant.schema';
import { ReservationFindManySchema as ReservationFindManySchema } from '../findManyReservation.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { WatchSpecArgsObjectSchema as WatchSpecArgsObjectSchema } from './WatchSpecArgs.schema';
import { ProductCountOutputTypeArgsObjectSchema as ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  slug: z.boolean().optional(),
  title: z.boolean().optional(),
  primaryImageUrl: z.boolean().optional(),
  type: z.boolean().optional(),
  priceVisibility: z.boolean().optional(),
  brandId: z.boolean().optional(),
  seoTitle: z.boolean().optional(),
  seoDescription: z.boolean().optional(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.boolean().optional(),
  publishedAt: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tag: z.boolean().optional(),
  status: z.boolean().optional(),
  AcquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  InvoiceItem: z.union([z.boolean(), z.lazy(() => InvoiceItemFindManySchema)]).optional(),
  maintenanceRecords: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  brand: z.union([z.boolean(), z.lazy(() => BrandArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  image: z.union([z.boolean(), z.lazy(() => ProductImageFindManySchema)]).optional(),
  variants: z.union([z.boolean(), z.lazy(() => ProductVariantFindManySchema)]).optional(),
  Reservation: z.union([z.boolean(), z.lazy(() => ReservationFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  watchSpec: z.union([z.boolean(), z.lazy(() => WatchSpecArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductSelectObjectSchema: z.ZodType<Prisma.ProductSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductSelect>;
export const ProductSelectObjectZodSchema = makeSchema();
