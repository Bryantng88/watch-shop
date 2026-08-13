import * as z from 'zod';
export const CarrierStatusHistoryFindManyResultSchema = z.object({
  data: z.array(z.object({
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