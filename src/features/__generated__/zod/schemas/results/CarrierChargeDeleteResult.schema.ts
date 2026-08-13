import * as z from 'zod';
export const CarrierChargeDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  shipmentId: z.string(),
  kind: z.unknown(),
  currency: z.string(),
  estimatedAmount: z.number().optional(),
  chargedAmount: z.number().optional(),
  settlementStatus: z.unknown(),
  settlementRef: z.string().optional(),
  settledAt: z.date().optional(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  shipment: z.unknown()
}));