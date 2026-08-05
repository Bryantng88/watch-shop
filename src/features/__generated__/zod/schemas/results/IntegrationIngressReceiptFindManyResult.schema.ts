import * as z from 'zod';
export const IntegrationIngressReceiptFindManyResultSchema = z.object({
  data: z.array(z.object({
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