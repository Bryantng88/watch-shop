import * as z from 'zod';

// prettier-ignore
export const IntegrationIngressReceiptModelSchema = z.object({
    id: z.string(),
    channel: z.string(),
    keyId: z.string(),
    nonce: z.string(),
    eventId: z.string(),
    eventType: z.string(),
    requestHash: z.string(),
    status: z.string(),
    responseJson: z.unknown().nullable(),
    lastError: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    expiresAt: z.date()
}).strict();

export type IntegrationIngressReceiptPureType = z.infer<typeof IntegrationIngressReceiptModelSchema>;
