import * as z from 'zod';
export const CarrierWebhookDeliveryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    carrierCode: z.number(),
    environment: z.number(),
    externalEventId: z.number(),
    externalOrderCode: z.number(),
    payloadHash: z.number(),
    payloadJson: z.number(),
    signatureValid: z.number(),
    status: z.number(),
    receivedAt: z.number(),
    processedAt: z.number(),
    errorMessage: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    carrierCode: z.string().nullable(),
    environment: z.string().nullable(),
    externalEventId: z.string().nullable(),
    externalOrderCode: z.string().nullable(),
    payloadHash: z.string().nullable(),
    receivedAt: z.date().nullable(),
    processedAt: z.date().nullable(),
    errorMessage: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    carrierCode: z.string().nullable(),
    environment: z.string().nullable(),
    externalEventId: z.string().nullable(),
    externalOrderCode: z.string().nullable(),
    payloadHash: z.string().nullable(),
    receivedAt: z.date().nullable(),
    processedAt: z.date().nullable(),
    errorMessage: z.string().nullable()
  }).nullable().optional()});