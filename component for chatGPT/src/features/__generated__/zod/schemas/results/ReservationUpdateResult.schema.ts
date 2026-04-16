import * as z from 'zod';
export const ReservationUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  status: z.unknown(),
  depositAmt: z.number().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z.unknown().optional()
}));