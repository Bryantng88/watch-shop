import * as z from 'zod';
export const CarrierChargeFindManyResultSchema = z.object({
  data: z.array(z.object({
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