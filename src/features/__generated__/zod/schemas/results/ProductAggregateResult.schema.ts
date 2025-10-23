import * as z from 'zod';
export const ProductAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    slug: z.number(),
    title: z.number(),
    status: z.number(),
    primaryImageUrl: z.number(),
    type: z.number(),
    brandId: z.number(),
    seoTitle: z.number(),
    seoDescription: z.number(),
    isStockManaged: z.number(),
    maxQtyPerOrder: z.number(),
    publishedAt: z.number(),
    vendorId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    tag: z.number(),
    AcquisitionItem: z.number(),
    InvoiceItem: z.number(),
    maintenanceRecords: z.number(),
    orderItems: z.number(),
    brand: z.number(),
    vendor: z.number(),
    image: z.number(),
    variants: z.number(),
    Reservation: z.number(),
    ServiceRequest: z.number(),
    watchSpec: z.number()
  }).optional(),
  _sum: z.object({
    maxQtyPerOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    maxQtyPerOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    slug: z.string().nullable(),
    title: z.string().nullable(),
    primaryImageUrl: z.string().nullable(),
    brandId: z.string().nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    maxQtyPerOrder: z.number().int().nullable(),
    publishedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    slug: z.string().nullable(),
    title: z.string().nullable(),
    primaryImageUrl: z.string().nullable(),
    brandId: z.string().nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    maxQtyPerOrder: z.number().int().nullable(),
    publishedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});