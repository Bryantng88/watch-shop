import * as z from 'zod';
export const ProductVariantAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    productId: z.number(),
    sku: z.number(),
    name: z.number(),
    price: z.number(),
    stockQty: z.number(),
    isStockManaged: z.number(),
    maxQtyPerOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    availabilityStatus: z.number(),
    acquisitionItem: z.number(),
    invoiceItem: z.number(),
    maintenancePart: z.number(),
    maintenanceRecord: z.number(),
    partSpec: z.number(),
    product: z.number(),
    serviceRequest: z.number(),
    strapSpec: z.number()
  }).optional(),
  _sum: z.object({
    price: z.number().nullable(),
    stockQty: z.number().nullable(),
    maxQtyPerOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    price: z.number().nullable(),
    stockQty: z.number().nullable(),
    maxQtyPerOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    sku: z.string().nullable(),
    name: z.string().nullable(),
    price: z.number().nullable(),
    stockQty: z.number().int().nullable(),
    maxQtyPerOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    sku: z.string().nullable(),
    name: z.string().nullable(),
    price: z.number().nullable(),
    stockQty: z.number().int().nullable(),
    maxQtyPerOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});