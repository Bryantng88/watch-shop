import * as z from 'zod';
export const OrderItemCreateResultSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  title: z.string(),
  listPrice: z.number(),
  discountType: z.unknown().optional(),
  discountValue: z.number().optional(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional(),
  createdAt: z.date(),
  acquisitionItem: z.array(z.unknown()),
  order: z.unknown(),
  Product: z.unknown().optional(),
  serviceRequest: z.array(z.unknown())
});