import * as z from 'zod';

import { CarrierWebhookStatusSchema } from '../../enums/CarrierWebhookStatus.schema';
// prettier-ignore
export const CarrierWebhookDeliveryResultSchema = z.object({
    id: z.string(),
    carrierCode: z.string(),
    environment: z.string(),
    externalEventId: z.string().nullable(),
    externalOrderCode: z.string().nullable(),
    payloadHash: z.string(),
    payloadJson: z.unknown(),
    signatureValid: z.boolean(),
    status: CarrierWebhookStatusSchema,
    receivedAt: z.date(),
    processedAt: z.date().nullable(),
    errorMessage: z.string().nullable()
}).strict();

export type CarrierWebhookDeliveryResultType = z.infer<typeof CarrierWebhookDeliveryResultSchema>;
