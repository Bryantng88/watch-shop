import * as z from 'zod';

// prettier-ignore
export const UserCommentResultSchema = z.object({
    id: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().nullable(),
    body: z.string(),
    visibility: z.string(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UserCommentResultType = z.infer<typeof UserCommentResultSchema>;
