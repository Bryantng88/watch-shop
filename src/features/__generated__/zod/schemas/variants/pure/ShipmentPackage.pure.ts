import * as z from 'zod';

// prettier-ignore
export const ShipmentPackageModelSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    weightGram: z.number().int(),
    lengthCm: z.number().int().nullable(),
    widthCm: z.number().int().nullable(),
    heightCm: z.number().int().nullable(),
    itemCount: z.number().int(),
    declaredValue: z.number().nullable(),
    contentDescription: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    shipment: z.unknown()
}).strict();

export type ShipmentPackagePureType = z.infer<typeof ShipmentPackageModelSchema>;
