import * as z from 'zod';

// prettier-ignore
export const WorkflowConditionModelSchema = z.object({
    id: z.string(),
    workflowId: z.string(),
    eventKey: z.string(),
    targetType: z.string().nullable(),
    sortOrder: z.number().int(),
    configJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workflow: z.unknown()
}).strict();

export type WorkflowConditionPureType = z.infer<typeof WorkflowConditionModelSchema>;
