import * as z from 'zod';
export const CarrierWebhookDeliveryDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  carrierCode: z.string(),
  environment: z.string(),
  externalEventId: z.string().optional(),
  externalOrderCode: z.string().optional(),
  payloadHash: z.string(),
  payloadJson: z.unknown(),
  signatureValid: z.boolean(),
  status: z.unknown(),
  receivedAt: z.date(),
  processedAt: z.date().optional(),
  errorMessage: z.string().optional()
}));