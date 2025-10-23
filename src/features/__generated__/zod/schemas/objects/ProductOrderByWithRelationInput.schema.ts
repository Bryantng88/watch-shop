import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionItemOrderByRelationAggregateInputObjectSchema as AcquisitionItemOrderByRelationAggregateInputObjectSchema } from './AcquisitionItemOrderByRelationAggregateInput.schema';
import { InvoiceItemOrderByRelationAggregateInputObjectSchema as InvoiceItemOrderByRelationAggregateInputObjectSchema } from './InvoiceItemOrderByRelationAggregateInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { OrderItemOrderByRelationAggregateInputObjectSchema as OrderItemOrderByRelationAggregateInputObjectSchema } from './OrderItemOrderByRelationAggregateInput.schema';
import { BrandOrderByWithRelationInputObjectSchema as BrandOrderByWithRelationInputObjectSchema } from './BrandOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema';
import { ProductImageOrderByRelationAggregateInputObjectSchema as ProductImageOrderByRelationAggregateInputObjectSchema } from './ProductImageOrderByRelationAggregateInput.schema';
import { ProductVariantOrderByRelationAggregateInputObjectSchema as ProductVariantOrderByRelationAggregateInputObjectSchema } from './ProductVariantOrderByRelationAggregateInput.schema';
import { ReservationOrderByRelationAggregateInputObjectSchema as ReservationOrderByRelationAggregateInputObjectSchema } from './ReservationOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { WatchSpecOrderByWithRelationInputObjectSchema as WatchSpecOrderByWithRelationInputObjectSchema } from './WatchSpecOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  slug: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  primaryImageUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  brandId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  seoTitle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  seoDescription: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isStockManaged: SortOrderSchema.optional(),
  maxQtyPerOrder: SortOrderSchema.optional(),
  publishedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  tag: SortOrderSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemOrderByRelationAggregateInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemOrderByRelationAggregateInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  brand: z.lazy(() => BrandOrderByWithRelationInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageOrderByRelationAggregateInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantOrderByRelationAggregateInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationOrderByRelationAggregateInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ProductOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductOrderByWithRelationInput>;
export const ProductOrderByWithRelationInputObjectZodSchema = makeSchema();
