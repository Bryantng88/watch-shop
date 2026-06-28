import * as z from 'zod';

import { WorkflowExecutionStatusSchema } from '../../enums/WorkflowExecutionStatus.schema';
// prettier-ignore
export const WorkflowExecutionResultSchema = z.object({
    id: z.string(),
    workflowId: z.string(),
    actionTargetType: z.string(),
    actionTargetId: z.string(),
    status: WorkflowExecutionStatusSchema,
    errorMessage: z.string().nullable(),
    metadataJson: z.unknown().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    failedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workflow: z.unknown(),
    events: z.array(z.unknown())
}).strict();

export type WorkflowExecutionResultType = z.infer<typeof WorkflowExecutionResultSchema>;
