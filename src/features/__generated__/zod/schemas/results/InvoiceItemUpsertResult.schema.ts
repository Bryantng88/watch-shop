import * as z from 'zod';
export const InvoiceItemUpsertResultSchema = z.object({
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
  Invoice: z.unknown(),
  Product: z.unknown().optional(),
  ProductVariant: z.unknown().optional()
});