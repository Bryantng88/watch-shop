import * as z from 'zod';
export const PaymentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  paidAt: z.date(),
  reference: z.string(),
  note: z.string(),
  createdAt: z.date(),
  order_id: z.string(),
  service_request_id: z.string(),
  vendor_id: z.string(),
  acquisition_id: z.string(),
  _count: z.object({
    id: z.number(),
    method: z.number(),
    amount: z.number(),
    currency: z.number(),
    paidAt: z.number(),
    reference: z.number(),
    note: z.number(),
    createdAt: z.number(),
    direction: z.number(),
    order_id: z.number(),
    service_request_id: z.number(),
    vendor_id: z.number(),
    acquisition_id: z.number(),
    status: z.number(),
    purpose: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    paidAt: z.date().nullable(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    order_id: z.string().nullable(),
    service_request_id: z.string().nullable(),
    vendor_id: z.string().nullable(),
    acquisition_id: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    paidAt: z.date().nullable(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    order_id: z.string().nullable(),
    service_request_id: z.string().nullable(),
    vendor_id: z.string().nullable(),
    acquisition_id: z.string().nullable()
  }).nullable().optional()
}));