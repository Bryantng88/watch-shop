import * as z from 'zod';

// prettier-ignore
export const CarrierStatusHistoryModelSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    carrierCode: z.string(),
    externalStatus: z.string(),
    normalizedStatus: z.string(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    occurredAt: z.date(),
    payloadJson: z.unknown().nullable(),
    createdAt: z.date(),
    shipment: z.unknown()
}).strict();

export type CarrierStatusHistoryPureType = z.infer<typeof CarrierStatusHistoryModelSchema>;
