import * as z from 'zod';
export const CarrierWebhookDeliveryGroupByResultSchema = z.array(z.object({
  id: z.string(),
  carrierCode: z.string(),
  environment: z.string(),
  externalEventId: z.string(),
  externalOrderCode: z.string(),
  payloadHash: z.string(),
  payloadJson: z.unknown(),
  signatureValid: z.boolean(),
  receivedAt: z.date(),
  processedAt: z.date(),
  errorMessage: z.string(),
  _count: z.object({
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
  }).nullable().optional()
}));