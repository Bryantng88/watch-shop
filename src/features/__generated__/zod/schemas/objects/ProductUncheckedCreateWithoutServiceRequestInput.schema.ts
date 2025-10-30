import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { TagSchema } from '../enums/Tag.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutProductInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema as ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateNestedManyWithoutProductInput.schema';
import { ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema as ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ProductVariantUncheckedCreateNestedManyWithoutProductInput.schema';
import { ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema as ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './ReservationUncheckedCreateNestedManyWithoutProductInput.schema';
import { WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema as WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateNestedOneWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  contentStatus: ContentStatusSchema.optional(),
  type: ProductTypeSchema,
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
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  maintenanceRecords: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  image: z.lazy(() => ProductImageUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  variants: z.lazy(() => ProductVariantUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  Reservation: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  watchSpec: z.lazy(() => WatchSpecUncheckedCreateNestedOneWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutServiceRequestInput>;
export const ProductUncheckedCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
