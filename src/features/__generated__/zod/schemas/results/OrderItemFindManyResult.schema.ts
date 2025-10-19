import * as z from 'zod';
export const OrderItemFindManyResultSchema = z.object({
  data: z.array(z.object({
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