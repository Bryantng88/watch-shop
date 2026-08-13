import * as z from 'zod';
export const ShipmentPackageFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  shipmentId: z.string(),
  weightGram: z.number().int(),
  lengthCm: z.number().int().optional(),
  widthCm: z.number().int().optional(),
  heightCm: z.number().int().optional(),
  itemCount: z.number().int(),
  declaredValue: z.number().optional(),
  contentDescription: z.string().optional(),
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