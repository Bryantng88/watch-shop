import * as z from 'zod';
export const PaymentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  invoiceId: z.string(),
  method: z.unknown(),
  amount: z.number(),
  currency: z.string(),
  paidAt: z.date(),
  reference: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  invoice: z.unknown()
}));