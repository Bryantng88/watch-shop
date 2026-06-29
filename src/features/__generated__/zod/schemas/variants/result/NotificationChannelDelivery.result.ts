import * as z from 'zod';

// prettier-ignore
export const NotificationChannelDeliveryResultSchema = z.object({
    id: z.string(),
    dispatchId: z.string(),
    channel: z.string(),
    recipientGroupKey: z.string(),
    status: z.string(),
    errorMessage: z.string().nullable(),
    payloadJson: z.unknown().nullable(),
    sentAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationChannelDeliveryResultType = z.infer<typeof NotificationChannelDeliveryResultSchema>;
