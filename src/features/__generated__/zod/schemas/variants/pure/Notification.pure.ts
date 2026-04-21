import * as z from 'zod';

// prettier-ignore
export const NotificationModelSchema = z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
    priority: z.string(),
    isRead: z.boolean(),
    userId: z.string(),
    metadata: z.unknown().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date(),
    User: z.unknown()
}).strict();

export type NotificationPureType = z.infer<typeof NotificationModelSchema>;
