import * as z from 'zod';

// prettier-ignore
export const NotificationInputSchema = z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
    priority: z.string(),
    isRead: z.boolean(),
    userId: z.string(),
    metadata: z.unknown().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    User: z.unknown()
}).strict();

export type NotificationInputType = z.infer<typeof NotificationInputSchema>;
