import * as z from 'zod';

// prettier-ignore
export const TaskItemActivityReplyModelSchema = z.object({
    id: z.string(),
    activityId: z.string(),
    actorUserId: z.string().nullable(),
    body: z.string(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    activity: z.unknown(),
    actorUser: z.unknown().nullable()
}).strict();

export type TaskItemActivityReplyPureType = z.infer<typeof TaskItemActivityReplyModelSchema>;
