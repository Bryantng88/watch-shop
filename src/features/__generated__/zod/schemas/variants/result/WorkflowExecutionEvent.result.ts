import * as z from 'zod';

// prettier-ignore
export const WorkflowExecutionEventResultSchema = z.object({
    id: z.string(),
    executionId: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string(),
    eventLogId: z.string().nullable(),
    createdAt: z.date(),
    execution: z.unknown()
}).strict();

export type WorkflowExecutionEventResultType = z.infer<typeof WorkflowExecutionEventResultSchema>;
