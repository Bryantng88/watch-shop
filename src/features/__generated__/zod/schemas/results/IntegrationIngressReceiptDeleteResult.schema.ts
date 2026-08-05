import * as z from 'zod';
export const IntegrationIngressReceiptDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  channel: z.string(),
  keyId: z.string(),
  nonce: z.string(),
  eventId: z.string(),
  eventType: z.string(),
  requestHash: z.string(),
  status: z.string(),
  responseJson: z.unknown().optional(),
  lastError: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date()
}));