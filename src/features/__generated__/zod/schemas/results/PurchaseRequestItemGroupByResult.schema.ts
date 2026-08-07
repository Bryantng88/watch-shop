import * as z from 'zod';
export const PurchaseRequestItemGroupByResultSchema = z.array(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    purchaseRequestId: z.number(),
    productId: z.number(),
    titleSnapshot: z.number(),
    listPriceSnapshot: z.number(),
    quantity: z.number(),
    createdAt: z.number(),
    purchaseRequest: z.number(),
    product: z.number()
  }).optional(),
  _sum: z.object({
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    productId: z.string().nullable(),
    titleSnapshot: z.string().nullable(),
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().int().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    productId: z.string().nullable(),
    titleSnapshot: z.string().nullable(),
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().int().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));