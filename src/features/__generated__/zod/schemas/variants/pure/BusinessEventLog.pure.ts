import * as z from 'zod';

// prettier-ignore
export const BusinessEventLogModelSchema = z.object({
    id: z.string(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().nullable(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    workflowEvents: z.array(z.unknown())
}).strict();

export type BusinessEventLogPureType = z.infer<typeof BusinessEventLogModelSchema>;
