import * as z from 'zod';
export const InvoiceItemFindUniqueResultSchema = z.nullable(z.object({
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
}));