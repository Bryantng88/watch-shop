import * as z from 'zod';

// prettier-ignore
export const NotificationChannelDeliveryInputSchema = z.object({
    id: z.string(),
    dispatchId: z.string(),
    channel: z.string(),
    recipientGroupKey: z.string(),
    status: z.string(),
    errorMessage: z.string().optional().nullable(),
    payloadJson: z.unknown().optional().nullable(),
    sentAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationChannelDeliveryInputType = z.infer<typeof NotificationChannelDeliveryInputSchema>;
