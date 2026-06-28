import * as z from 'zod';

import { WorkflowActionTypeSchema } from '../../enums/WorkflowActionType.schema';
// prettier-ignore
export const WorkflowActionModelSchema = z.object({
    id: z.string(),
    workflowId: z.string(),
    actionType: WorkflowActionTypeSchema,
    sortOrder: z.number().int(),
    configJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workflow: z.unknown()
}).strict();

export type WorkflowActionPureType = z.infer<typeof WorkflowActionModelSchema>;
