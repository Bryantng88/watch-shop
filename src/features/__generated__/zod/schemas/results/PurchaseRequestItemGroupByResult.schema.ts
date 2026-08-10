import * as z from 'zod';
export const PurchaseRequestItemGroupByResultSchema = z.array(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int(),
  agreedPrice: z.number(),
  decisionReason: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    purchaseRequestId: z.number(),
    productId: z.number(),
    titleSnapshot: z.number(),
    listPriceSnapshot: z.number(),
    quantity: z.number(),
    decision: z.number(),
    agreedPrice: z.number(),
    decisionReason: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    purchaseRequest: z.number(),
    product: z.number()
  }).optional(),
  _sum: z.object({
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().nullable(),
    agreedPrice: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().nullable(),
    agreedPrice: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    productId: z.string().nullable(),
    titleSnapshot: z.string().nullable(),
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().int().nullable(),
    agreedPrice: z.number().nullable(),
    decisionReason: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    productId: z.string().nullable(),
    titleSnapshot: z.string().nullable(),
    listPriceSnapshot: z.number().nullable(),
    quantity: z.number().int().nullable(),
    agreedPrice: z.number().nullable(),
    decisionReason: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));