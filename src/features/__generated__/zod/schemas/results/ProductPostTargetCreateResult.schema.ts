import * as z from 'zod';
export const ProductPostTargetCreateResultSchema = z.object({
  productId: z.string(),
  postTargetId: z.string(),
  createdAt: z.date(),
  product: z.unknown(),
  postTarget: z.unknown()
});