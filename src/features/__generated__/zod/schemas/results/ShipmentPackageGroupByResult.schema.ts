import * as z from 'zod';
export const ShipmentPackageGroupByResultSchema = z.array(z.object({
  id: z.string(),
  shipmentId: z.string(),
  weightGram: z.number().int(),
  lengthCm: z.number().int(),
  widthCm: z.number().int(),
  heightCm: z.number().int(),
  itemCount: z.number().int(),
  declaredValue: z.number(),
  contentDescription: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    shipmentId: z.number(),
    weightGram: z.number(),
    lengthCm: z.number(),
    widthCm: z.number(),
    heightCm: z.number(),
    itemCount: z.number(),
    declaredValue: z.number(),
    contentDescription: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    shipment: z.number()
  }).optional(),
  _sum: z.object({
    weightGram: z.number().nullable(),
    lengthCm: z.number().nullable(),
    widthCm: z.number().nullable(),
    heightCm: z.number().nullable(),
    itemCount: z.number().nullable(),
    declaredValue: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    weightGram: z.number().nullable(),
    lengthCm: z.number().nullable(),
    widthCm: z.number().nullable(),
    heightCm: z.number().nullable(),
    itemCount: z.number().nullable(),
    declaredValue: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    weightGram: z.number().int().nullable(),
    lengthCm: z.number().int().nullable(),
    widthCm: z.number().int().nullable(),
    heightCm: z.number().int().nullable(),
    itemCount: z.number().int().nullable(),
    declaredValue: z.number().nullable(),
    contentDescription: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    weightGram: z.number().int().nullable(),
    lengthCm: z.number().int().nullable(),
    widthCm: z.number().int().nullable(),
    heightCm: z.number().int().nullable(),
    itemCount: z.number().int().nullable(),
    declaredValue: z.number().nullable(),
    contentDescription: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));