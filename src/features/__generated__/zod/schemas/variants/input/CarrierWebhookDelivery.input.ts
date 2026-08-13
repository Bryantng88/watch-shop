import * as z from 'zod';

import { CarrierWebhookStatusSchema } from '../../enums/CarrierWebhookStatus.schema';
// prettier-ignore
export const CarrierWebhookDeliveryInputSchema = z.object({
    id: z.string(),
    carrierCode: z.string(),
    environment: z.string(),
    externalEventId: z.string().optional().nullable(),
    externalOrderCode: z.string().optional().nullable(),
    payloadHash: z.string(),
    payloadJson: z.unknown(),
    signatureValid: z.boolean(),
    status: CarrierWebhookStatusSchema,
    receivedAt: z.date(),
    processedAt: z.date().optional().nullable(),
    errorMessage: z.string().optional().nullable()
}).strict();

export type CarrierWebhookDeliveryInputType = z.infer<typeof CarrierWebhookDeliveryInputSchema>;
