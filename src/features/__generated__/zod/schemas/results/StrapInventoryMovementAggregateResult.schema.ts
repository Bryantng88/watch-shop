import * as z from 'zod';
export const StrapInventoryMovementAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    strapVariantId: z.number(),
    movementType: z.number(),
    quantity: z.number(),
    balanceAfter: z.number(),
    watchId: z.number(),
    orderId: z.number(),
    serviceRequestId: z.number(),
    actorUserId: z.number(),
    sourceType: z.number(),
    sourceId: z.number(),
    note: z.number(),
    createdAt: z.number(),
    strapVariant: z.number()
  }).optional(),
  _sum: z.object({
    quantity: z.number().nullable(),
    balanceAfter: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    quantity: z.number().nullable(),
    balanceAfter: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    strapVariantId: z.string().nullable(),
    quantity: z.number().int().nullable(),
    balanceAfter: z.number().int().nullable(),
    watchId: z.string().nullable(),
    orderId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    sourceType: z.string().nullable(),
    sourceId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    strapVariantId: z.string().nullable(),
    quantity: z.number().int().nullable(),
    balanceAfter: z.number().int().nullable(),
    watchId: z.string().nullable(),
    orderId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    sourceType: z.string().nullable(),
    sourceId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});