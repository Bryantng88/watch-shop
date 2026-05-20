import * as z from 'zod';
export const ReservationAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    productId: z.number(),
    orderId: z.number(),
    status: z.number(),
    depositAmt: z.number(),
    expiresAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    product: z.number()
  }).optional(),
  _sum: z.object({
    depositAmt: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    depositAmt: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    orderId: z.string().nullable(),
    depositAmt: z.number().nullable(),
    expiresAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    orderId: z.string().nullable(),
    depositAmt: z.number().nullable(),
    expiresAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});