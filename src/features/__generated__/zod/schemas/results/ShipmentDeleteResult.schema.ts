import * as z from 'zod';
export const ShipmentDeleteResultSchema = z.nullable(z.object({
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
  Order: z.unknown()
}));