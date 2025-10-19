import * as z from 'zod';
export const PaymentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  invoiceId: z.string(),
  amount: z.number(),
  currency: z.string(),
  paidAt: z.date(),
  reference: z.string(),
  note: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    invoiceId: z.number(),
    method: z.number(),
    amount: z.number(),
    currency: z.number(),
    paidAt: z.number(),
    reference: z.number(),
    note: z.number(),
    createdAt: z.number(),
    invoice: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    invoiceId: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    paidAt: z.date().nullable(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    invoiceId: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    paidAt: z.date().nullable(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));