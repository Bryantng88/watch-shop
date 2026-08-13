import * as z from 'zod';

// prettier-ignore
export const CarrierStatusHistoryInputSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    carrierCode: z.string(),
    externalStatus: z.string(),
    normalizedStatus: z.string(),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    occurredAt: z.date(),
    payloadJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    shipment: z.unknown()
}).strict();

export type CarrierStatusHistoryInputType = z.infer<typeof CarrierStatusHistoryInputSchema>;
