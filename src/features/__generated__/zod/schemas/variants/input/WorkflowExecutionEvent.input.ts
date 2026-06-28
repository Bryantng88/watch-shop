import * as z from 'zod';

// prettier-ignore
export const WorkflowExecutionEventInputSchema = z.object({
    id: z.string(),
    executionId: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string(),
    eventLogId: z.string().optional().nullable(),
    createdAt: z.date(),
    execution: z.unknown()
}).strict();

export type WorkflowExecutionEventInputType = z.infer<typeof WorkflowExecutionEventInputSchema>;
