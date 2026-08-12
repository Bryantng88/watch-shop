import * as z from 'zod';
export const PurchaseRequestIngressReceiptAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    requestKey: z.number(),
    requestHash: z.number(),
    purchaseRequestId: z.number(),
    disposition: z.number(),
    addedItemCount: z.number(),
    createdAt: z.number(),
    purchaseRequest: z.number()
  }).optional(),
  _sum: z.object({
    addedItemCount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    addedItemCount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    requestKey: z.string().nullable(),
    requestHash: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    addedItemCount: z.number().int().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    requestKey: z.string().nullable(),
    requestHash: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    addedItemCount: z.number().int().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});