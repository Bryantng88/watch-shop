import * as z from 'zod';
export const PaymentFindManyResultSchema = z.object({
  data: z.array(z.object({
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