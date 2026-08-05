import * as z from 'zod';

// prettier-ignore
export const IntegrationIngressReceiptInputSchema = z.object({
    id: z.string(),
    channel: z.string(),
    keyId: z.string(),
    nonce: z.string(),
    eventId: z.string(),
    eventType: z.string(),
    requestHash: z.string(),
    status: z.string(),
    responseJson: z.unknown().optional().nullable(),
    lastError: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    expiresAt: z.date()
}).strict();

export type IntegrationIngressReceiptInputType = z.infer<typeof IntegrationIngressReceiptInputSchema>;
