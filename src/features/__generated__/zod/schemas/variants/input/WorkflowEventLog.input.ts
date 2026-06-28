import * as z from 'zod';

// prettier-ignore
export const WorkflowEventLogInputSchema = z.object({
    id: z.string(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date()
}).strict();

export type WorkflowEventLogInputType = z.infer<typeof WorkflowEventLogInputSchema>;
