import * as z from 'zod';
export const OrderItemAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    orderId: z.number(),
    productId: z.number(),
    title: z.number(),
    price: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
    img: z.number(),
    createdAt: z.number(),
    AcquisitionItem: z.number(),
    order: z.number(),
    Product: z.number(),
    ServiceRequest: z.number()
  }).optional(),
  _sum: z.object({
    price: z.number().nullable(),
    quantity: z.number().nullable(),
    subtotal: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    price: z.number().nullable(),
    quantity: z.number().nullable(),
    subtotal: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    productId: z.string().nullable(),
    title: z.string().nullable(),
    price: z.number().nullable(),
    quantity: z.number().int().nullable(),
    subtotal: z.number().nullable(),
    img: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    productId: z.string().nullable(),
    title: z.string().nullable(),
    price: z.number().nullable(),
    quantity: z.number().int().nullable(),
    subtotal: z.number().nullable(),
    img: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});