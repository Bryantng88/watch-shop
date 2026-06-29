import * as z from 'zod';

// prettier-ignore
export const NotificationRuleResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    eventKey: z.string(),
    enabled: z.boolean(),
    channel: z.string(),
    recipientGroupKey: z.string(),
    titleTemplate: z.string().nullable(),
    messageTemplate: z.string(),
    priority: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationRuleResultType = z.infer<typeof NotificationRuleResultSchema>;
