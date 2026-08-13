import * as z from 'zod';
export const CarrierRequestDeleteResultSchema = z.nullable(z.object({
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
}));