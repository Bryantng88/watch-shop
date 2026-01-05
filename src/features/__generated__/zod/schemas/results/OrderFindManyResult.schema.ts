import * as z from 'zod';
export const OrderFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  refNo: z.string().optional(),
  customerId: z.string().optional(),
  shipPhone: z.string(),
  shipAddress: z.string(),
  shipWard: z.string().optional(),
  shipCity: z.string(),
  subtotal: z.number(),
  shippingFee: z.number().optional(),
  status: z.unknown(),
  paymentStatus: z.unknown(),
  paymentMethod: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  shipDistrict: z.string().optional(),
  hasShipment: z.boolean(),
  reservetype: z.unknown().optional(),
  reserveuntil: z.date().optional(),
  depositqequired: z.number().optional(),
  depositpaid: z.number().optional(),
  Invoice: z.array(z.unknown()),
  customer: z.unknown().optional(),
  items: z.array(z.unknown()),
  Shipment: z.unknown().optional()
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