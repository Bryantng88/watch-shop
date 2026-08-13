import * as z from 'zod';
export const ShipmentPackageCreateResultSchema = z.object({
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
});