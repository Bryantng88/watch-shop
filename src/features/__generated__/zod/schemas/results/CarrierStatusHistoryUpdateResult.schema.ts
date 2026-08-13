import * as z from 'zod';
export const CarrierStatusHistoryUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  shipmentId: z.string(),
  carrierCode: z.string(),
  externalStatus: z.string(),
  normalizedStatus: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  occurredAt: z.date(),
  payloadJson: z.unknown().optional(),
  createdAt: z.date(),
  shipment: z.unknown()
}));