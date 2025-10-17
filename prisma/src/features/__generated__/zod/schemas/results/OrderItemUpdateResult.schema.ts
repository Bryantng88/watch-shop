import * as z from 'zod';
export const OrderItemUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string().optional(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional(),
  createdAt: z.date(),
  AcquisitionItem: z.array(z.unknown()),
  order: z.unknown(),
  Product: z.unknown().optional(),
  ServiceRequest: z.array(z.unknown())
}));