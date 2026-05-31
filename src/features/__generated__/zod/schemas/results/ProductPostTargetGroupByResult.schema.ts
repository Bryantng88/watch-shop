import * as z from 'zod';
export const ProductPostTargetGroupByResultSchema = z.array(z.object({
  productId: z.string(),
  postTargetId: z.string(),
  createdAt: z.date(),
  _count: z.object({
    productId: z.number(),
    postTargetId: z.number(),
    createdAt: z.number(),
    product: z.number(),
    postTarget: z.number()
  }).optional(),
  _min: z.object({
    productId: z.string().nullable(),
    postTargetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    productId: z.string().nullable(),
    postTargetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));