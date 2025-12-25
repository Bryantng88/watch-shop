import * as z from 'zod';
export const OrderFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  orderCode: z.string(),
  customerId: z.string().optional(),
  shipPhone: z.string(),
  shipEmail: z.string(),
  shipAddress: z.string(),
  shipWard: z.string().optional(),
  shipCity: z.string(),
  subtotal: z.number(),
  shippingFee: z.number().optional(),
  total: z.number(),
  status: z.unknown(),
  paymentStatus: z.unknown(),
  paymentMethod: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  Invoice: z.array(z.unknown()),
  customer: z.unknown().optional(),
  items: z.array(z.unknown())
}));