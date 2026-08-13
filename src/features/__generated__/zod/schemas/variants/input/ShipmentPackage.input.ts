import * as z from 'zod';

// prettier-ignore
export const ShipmentPackageInputSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    weightGram: z.number().int(),
    lengthCm: z.number().int().optional().nullable(),
    widthCm: z.number().int().optional().nullable(),
    heightCm: z.number().int().optional().nullable(),
    itemCount: z.number().int(),
    declaredValue: z.number().optional().nullable(),
    contentDescription: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    shipment: z.unknown()
}).strict();

export type ShipmentPackageInputType = z.infer<typeof ShipmentPackageInputSchema>;
