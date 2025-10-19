import * as z from 'zod';
export const InvoiceItemFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  invoiceId: z.string(),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  discount: z.number(),
  taxRate: z.number(),
  lineTotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  invoice: z.unknown(),
  product: z.unknown().optional(),
  variant: z.unknown().optional()
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