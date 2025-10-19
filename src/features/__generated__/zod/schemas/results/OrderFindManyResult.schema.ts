import * as z from 'zod';
export const OrderFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  orderCode: z.string(),
  customerId: z.string().optional(),
  shipName: z.string(),
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
  Invoice: z.array(z.unknown()),
  customer: z.unknown().optional(),
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