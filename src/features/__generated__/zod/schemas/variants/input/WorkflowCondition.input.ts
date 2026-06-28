import * as z from 'zod';

// prettier-ignore
export const WorkflowConditionInputSchema = z.object({
    id: z.string(),
    workflowId: z.string(),
    eventKey: z.string(),
    targetType: z.string().optional().nullable(),
    sortOrder: z.number().int(),
    configJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workflow: z.unknown()
}).strict();

export type WorkflowConditionInputType = z.infer<typeof WorkflowConditionInputSchema>;
