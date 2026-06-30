import * as z from 'zod';

// prettier-ignore
export const BusinessFeedbackInputSchema = z.object({
    id: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string().optional().nullable(),
    actorUserId: z.string().optional().nullable(),
    message: z.string(),
    visibility: z.string(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type BusinessFeedbackInputType = z.infer<typeof BusinessFeedbackInputSchema>;
