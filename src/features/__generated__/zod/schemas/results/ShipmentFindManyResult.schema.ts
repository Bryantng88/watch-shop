import * as z from 'zod';
export const ShipmentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  orderId: z.string(),
  shipPhone: z.string().optional(),
  shipAddress: z.string().optional(),
  shipCity: z.string().optional(),
  shipDistrict: z.string().optional(),
  shipWard: z.string().optional(),
  carrier: z.string().optional(),
  trackingCode: z.string().optional(),
  shippingFee: z.number(),
  currency: z.string(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.unknown(),
  refNo: z.string().optional(),
  orderRefNo: z.string().optional(),
  customerName: z.string().optional(),
  Order: z.unknown()
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