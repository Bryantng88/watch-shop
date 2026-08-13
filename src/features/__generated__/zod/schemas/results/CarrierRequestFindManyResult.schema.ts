import * as z from 'zod';
export const CarrierRequestFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  shipmentId: z.string(),
  carrierCode: z.string(),
  environment: z.string(),
  operation: z.string(),
  idempotencyKey: z.string(),
  requestJson: z.unknown(),
  responseJson: z.unknown().optional(),
  status: z.unknown(),
  httpStatus: z.number().int().optional(),
  externalOrderCode: z.string().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  attemptCount: z.number().int(),
  requestedAt: z.date(),
  completedAt: z.date().optional(),
  shipment: z.unknown()
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