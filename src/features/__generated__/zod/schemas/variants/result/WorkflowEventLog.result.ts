import * as z from 'zod';

// prettier-ignore
export const WorkflowEventLogResultSchema = z.object({
    id: z.string(),
    eventKey: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    actorUserId: z.string().nullable(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date()
}).strict();

export type WorkflowEventLogResultType = z.infer<typeof WorkflowEventLogResultSchema>;
