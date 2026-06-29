import * as z from 'zod';

// prettier-ignore
export const BusinessEventLogInputSchema = z.object({
    id: z.string(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    workflowEvents: z.array(z.unknown())
}).strict();

export type BusinessEventLogInputType = z.infer<typeof BusinessEventLogInputSchema>;
