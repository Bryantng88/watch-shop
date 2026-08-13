import * as z from 'zod';
export const CarrierStatusHistoryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    shipmentId: z.number(),
    carrierCode: z.number(),
    externalStatus: z.number(),
    normalizedStatus: z.number(),
    description: z.number(),
    location: z.number(),
    occurredAt: z.number(),
    payloadJson: z.number(),
    createdAt: z.number(),
    shipment: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    carrierCode: z.string().nullable(),
    externalStatus: z.string().nullable(),
    normalizedStatus: z.string().nullable(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    occurredAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    carrierCode: z.string().nullable(),
    externalStatus: z.string().nullable(),
    normalizedStatus: z.string().nullable(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    occurredAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});