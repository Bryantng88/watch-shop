import * as z from 'zod';

// prettier-ignore
export const NotificationDispatchResultSchema = z.object({
    id: z.string(),
    businessEventLogId: z.string().nullable(),
    ruleId: z.string().nullable(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    status: z.string(),
    errorMessage: z.string().nullable(),
    payloadJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationDispatchResultType = z.infer<typeof NotificationDispatchResultSchema>;
