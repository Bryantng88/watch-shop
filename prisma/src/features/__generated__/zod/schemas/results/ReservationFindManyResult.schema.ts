import * as z from 'zod';
export const ReservationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  status: z.unknown(),
  depositAmt: z.number().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z.unknown().optional()
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