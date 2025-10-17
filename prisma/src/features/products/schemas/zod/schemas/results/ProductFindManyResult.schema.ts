import * as z from 'zod';
export const ProductFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  status: z.unknown(),
  primaryImageUrl: z.string().optional(),
  type: z.unknown(),
  tag: z.unknown(),
  brandId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isStockManaged: z.boolean(),
  maxQtyPerOrder: z.number().int(),
  publishedAt: z.date().optional(),
  vendorId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  AcquisitionItem: z.array(z.unknown()),
  InvoiceItem: z.array(z.unknown()),
  maintenanceRecords: z.array(z.unknown()),
  orderItems: z.array(z.unknown()),
  brand: z.unknown().optional(),
  vendor: z.unknown().optional(),
  image: z.array(z.unknown()),
  variants: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown()),
  watchSpec: z.unknown().optional(),
  Reservation: z.array(z.unknown())
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});