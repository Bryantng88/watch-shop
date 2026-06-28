import * as z from 'zod';

import { WorkflowExecutionStatusSchema } from '../../enums/WorkflowExecutionStatus.schema';
// prettier-ignore
export const WorkflowExecutionInputSchema = z.object({
    id: z.string(),
    workflowId: z.string(),
    actionTargetType: z.string(),
    actionTargetId: z.string(),
    status: WorkflowExecutionStatusSchema,
    errorMessage: z.string().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    startedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    failedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workflow: z.unknown(),
    events: z.array(z.unknown())
}).strict();

export type WorkflowExecutionInputType = z.infer<typeof WorkflowExecutionInputSchema>;
