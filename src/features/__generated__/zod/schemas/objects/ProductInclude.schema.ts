import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { AcquisitionSpecJobFindManySchema as AcquisitionSpecJobFindManySchema } from '../findManyAcquisitionSpecJob.schema';
import { InvoiceItemFindManySchema as InvoiceItemFindManySchema } from '../findManyInvoiceItem.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { BrandArgsObjectSchema as BrandArgsObjectSchema } from './BrandArgs.schema';
import { ProductCategoryArgsObjectSchema as ProductCategoryArgsObjectSchema } from './ProductCategoryArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { ProductContentArgsObjectSchema as ProductContentArgsObjectSchema } from './ProductContentArgs.schema';
import { ProductImageFindManySchema as ProductImageFindManySchema } from '../findManyProductImage.schema';
import { ProductVariantFindManySchema as ProductVariantFindManySchema } from '../findManyProductVariant.schema';
import { ReservationFindManySchema as ReservationFindManySchema } from '../findManyReservation.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { WatchSpecArgsObjectSchema as WatchSpecArgsObjectSchema } from './WatchSpecArgs.schema';
import { ProductCountOutputTypeArgsObjectSchema as ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  AcquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  AcquisitionSpecJob: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobFindManySchema)]).optional(),
  InvoiceItem: z.union([z.boolean(), z.lazy(() => InvoiceItemFindManySchema)]).optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  brand: z.union([z.boolean(), z.lazy(() => BrandArgsObjectSchema)]).optional(),
  productCategory: z.union([z.boolean(), z.lazy(() => ProductCategoryArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  productContent: z.union([z.boolean(), z.lazy(() => ProductContentArgsObjectSchema)]).optional(),
  productImage: z.union([z.boolean(), z.lazy(() => ProductImageFindManySchema)]).optional(),
  productVariant: z.union([z.boolean(), z.lazy(() => ProductVariantFindManySchema)]).optional(),
  reservation: z.union([z.boolean(), z.lazy(() => ReservationFindManySchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  watchSpec: z.union([z.boolean(), z.lazy(() => WatchSpecArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductIncludeObjectSchema: z.ZodType<Prisma.ProductInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductInclude>;
export const ProductIncludeObjectZodSchema = makeSchema();
