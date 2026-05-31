import * as z from 'zod';
export const ProductPostTargetUpsertResultSchema = z.object({
  productId: z.string(),
  postTargetId: z.string(),
  createdAt: z.date(),
  product: z.unknown(),
  postTarget: z.unknown()
});