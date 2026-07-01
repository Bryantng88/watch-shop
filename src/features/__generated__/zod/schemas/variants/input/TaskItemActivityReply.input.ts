import * as z from 'zod';

// prettier-ignore
export const TaskItemActivityReplyInputSchema = z.object({
    id: z.string(),
    activityId: z.string(),
    actorUserId: z.string().optional().nullable(),
    body: z.string(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    activity: z.unknown(),
    actorUser: z.unknown().optional().nullable()
}).strict();

export type TaskItemActivityReplyInputType = z.infer<typeof TaskItemActivityReplyInputSchema>;
