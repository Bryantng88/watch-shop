import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutProductInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema as ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateNestedManyWithoutProductInput.schema';
import { ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema as ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateNestedManyWithoutProductInput.schema';
import { ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema as ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ReservationUncheckedCreateNestedManyWithoutProductInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutProductInput.schema';
import { WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema as WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateNestedOneWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  contentStatus: ContentStatusSchema.optional(),
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
  tag: TagSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  maintenanceRecords: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  image: z.lazy(() => ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  variants: z.lazy(() => ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  Reservation: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema),
  watchSpec: z.lazy(() => WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateInput>;
export const ProductUncheckedCreateInputObjectZodSchema = makeSchema();
