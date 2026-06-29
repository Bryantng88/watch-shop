import * as z from 'zod';

// prettier-ignore
export const WorkflowExecutionEventInputSchema = z.object({
    id: z.string(),
    executionId: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string(),
    createdAt: z.date(),
    execution: z.unknown(),
    businessEventLog: z.unknown().optional().nullable(),
    businessEventLogId: z.string().optional().nullable()
}).strict();

export type WorkflowExecutionEventInputType = z.infer<typeof WorkflowExecutionEventInputSchema>;
