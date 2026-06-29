import * as z from 'zod';

// prettier-ignore
export const NotificationRecipientGroupInputSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    roleNames: z.unknown().optional().nullable(),
    userIds: z.unknown().optional().nullable(),
    zaloGroupId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationRecipientGroupInputType = z.infer<typeof NotificationRecipientGroupInputSchema>;
