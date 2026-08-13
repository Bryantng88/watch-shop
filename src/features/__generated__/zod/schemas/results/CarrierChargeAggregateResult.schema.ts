import * as z from 'zod';
export const CarrierChargeAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    shipmentId: z.number(),
    kind: z.number(),
    currency: z.number(),
    estimatedAmount: z.number(),
    chargedAmount: z.number(),
    settlementStatus: z.number(),
    settlementRef: z.number(),
    settledAt: z.number(),
    metadataJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    shipment: z.number()
  }).optional(),
  _sum: z.object({
    estimatedAmount: z.number().nullable(),
    chargedAmount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    estimatedAmount: z.number().nullable(),
    chargedAmount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    currency: z.string().nullable(),
    estimatedAmount: z.number().nullable(),
    chargedAmount: z.number().nullable(),
    settlementRef: z.string().nullable(),
    settledAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    currency: z.string().nullable(),
    estimatedAmount: z.number().nullable(),
    chargedAmount: z.number().nullable(),
    settlementRef: z.string().nullable(),
    settledAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});