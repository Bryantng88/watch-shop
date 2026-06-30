import * as z from 'zod';

// prettier-ignore
export const BusinessFeedbackResultSchema = z.object({
    id: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string().nullable(),
    actorUserId: z.string().nullable(),
    message: z.string(),
    visibility: z.string(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type BusinessFeedbackResultType = z.infer<typeof BusinessFeedbackResultSchema>;
