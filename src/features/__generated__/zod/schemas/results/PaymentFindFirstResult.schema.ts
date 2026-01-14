import * as z from 'zod';
export const PaymentFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  method: z.unknown(),
  amount: z.number(),
  currency: z.string(),
  paidAt: z.date(),
  reference: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  direction: z.unknown().optional(),
  order_id: z.string().optional(),
  service_request_id: z.string().optional(),
  vendor_id: z.string().optional(),
  acquisition_id: z.string().optional(),
  status: z.unknown(),
  purpose: z.unknown(),
  shipment_id: z.string().optional(),
  type: z.unknown()
}));