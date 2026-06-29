import * as z from 'zod';

// prettier-ignore
export const NotificationRuleInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    eventKey: z.string(),
    enabled: z.boolean(),
    channel: z.string(),
    recipientGroupKey: z.string(),
    titleTemplate: z.string().optional().nullable(),
    messageTemplate: z.string(),
    priority: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationRuleInputType = z.infer<typeof NotificationRuleInputSchema>;
