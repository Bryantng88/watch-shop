import * as z from 'zod';

// prettier-ignore
export const NotificationRecipientGroupModelSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    roleNames: z.unknown().nullable(),
    userIds: z.unknown().nullable(),
    zaloGroupId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type NotificationRecipientGroupPureType = z.infer<typeof NotificationRecipientGroupModelSchema>;
