import * as z from 'zod';

// prettier-ignore
export const NotificationDispatchInputSchema = z.object({
    id: z.string(),
    businessEventLogId: z.string().optional().nullable(),
    ruleId: z.string().optional().nullable(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    status: z.string(),
    errorMessage: z.string().optional().nullable(),
    payloadJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationDispatchInputType = z.infer<typeof NotificationDispatchInputSchema>;
