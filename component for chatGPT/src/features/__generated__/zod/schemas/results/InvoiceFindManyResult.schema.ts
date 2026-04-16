import * as z from 'zod';
export const InvoiceFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  code: z.string().optional(),
  type: z.unknown(),
  status: z.unknown(),
  customerId: z.string().optional(),
  vendorId: z.string().optional(),
  orderId: z.string().optional(),
  acquisitionId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  currency: z.string(),
  subTotal: z.number(),
  taxTotal: z.number(),
  discountTotal: z.number(),
  grandTotal: z.number(),
  issuedAt: z.date().optional(),
  dueAt: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  acquisition: z.unknown().optional(),
  customer: z.unknown().optional(),
  order: z.unknown().optional(),
  serviceReq: z.unknown().optional(),
  vendor: z.unknown().optional(),
  items: z.array(z.unknown())
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