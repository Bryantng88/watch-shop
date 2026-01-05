import * as z from 'zod';
export const ShipmentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    orderId: z.number(),
    shipPhone: z.number(),
    shipAddress: z.number(),
    shipCity: z.number(),
    shipDistrict: z.number(),
    shipWard: z.number(),
    carrier: z.number(),
    trackingCode: z.number(),
    shippingFee: z.number(),
    currency: z.number(),
    shippedAt: z.number(),
    deliveredAt: z.number(),
    notes: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    status: z.number(),
    Order: z.number()
  }).optional(),
  _sum: z.object({
    shippingFee: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    shippingFee: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    shipPhone: z.string().nullable(),
    shipAddress: z.string().nullable(),
    shipCity: z.string().nullable(),
    shipDistrict: z.string().nullable(),
    shipWard: z.string().nullable(),
    carrier: z.string().nullable(),
    trackingCode: z.string().nullable(),
    shippingFee: z.number().nullable(),
    currency: z.string().nullable(),
    shippedAt: z.date().nullable(),
    deliveredAt: z.date().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    shipPhone: z.string().nullable(),
    shipAddress: z.string().nullable(),
    shipCity: z.string().nullable(),
    shipDistrict: z.string().nullable(),
    shipWard: z.string().nullable(),
    carrier: z.string().nullable(),
    trackingCode: z.string().nullable(),
    shippingFee: z.number().nullable(),
    currency: z.string().nullable(),
    shippedAt: z.date().nullable(),
    deliveredAt: z.date().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});