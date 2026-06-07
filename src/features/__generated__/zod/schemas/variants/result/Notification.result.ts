import * as z from 'zod';

// prettier-ignore
export const NotificationResultSchema = z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
    priority: z.string(),
    isRead: z.boolean(),
    userId: z.string(),
    taskId: z.string().nullable(),
    metadata: z.unknown().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date(),
    user: z.unknown(),
    task: z.unknown().nullable()
}).strict();

export type NotificationResultType = z.infer<typeof NotificationResultSchema>;
