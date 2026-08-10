import * as z from 'zod';
export const PurchaseRequestActivityGroupByResultSchema = z.array(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  note: z.string(),
  actorUserId: z.string(),
  followUpAt: z.date(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    purchaseRequestId: z.number(),
    type: z.number(),
    note: z.number(),
    actorUserId: z.number(),
    followUpAt: z.number(),
    createdAt: z.number(),
    purchaseRequest: z.number(),
    actor: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    note: z.string().nullable(),
    actorUserId: z.string().nullable(),
    followUpAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    purchaseRequestId: z.string().nullable(),
    note: z.string().nullable(),
    actorUserId: z.string().nullable(),
    followUpAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));