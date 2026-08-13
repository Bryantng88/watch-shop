import * as z from 'zod';
export const CarrierWebhookDeliveryFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});