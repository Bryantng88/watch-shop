import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutProductInput.schema';
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
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutMaintenanceRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutMaintenanceRecordsInput>;
export const ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectZodSchema = makeSchema();
