import * as z from 'zod';

// prettier-ignore
export const UserCommentInputSchema = z.object({
    id: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().optional().nullable(),
    body: z.string(),
    visibility: z.string(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type UserCommentInputType = z.infer<typeof UserCommentInputSchema>;
