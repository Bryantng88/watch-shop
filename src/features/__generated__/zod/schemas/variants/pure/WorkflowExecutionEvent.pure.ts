import * as z from 'zod';

// prettier-ignore
export const WorkflowExecutionEventModelSchema = z.object({
    id: z.string(),
    executionId: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    eventKey: z.string(),
    createdAt: z.date(),
    execution: z.unknown(),
    businessEventLog: z.unknown().nullable(),
    businessEventLogId: z.string().nullable()
}).strict();

export type WorkflowExecutionEventPureType = z.infer<typeof WorkflowExecutionEventModelSchema>;
