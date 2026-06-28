import * as z from 'zod';

import { WorkflowTemplateStatusSchema } from '../../enums/WorkflowTemplateStatus.schema';
import { WorkflowConditionStrategySchema } from '../../enums/WorkflowConditionStrategy.schema';
// prettier-ignore
export const WorkflowTemplateModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    status: WorkflowTemplateStatusSchema,
    strategy: WorkflowConditionStrategySchema,
    ownerType: z.string().nullable(),
    ownerId: z.string().nullable(),
    isSystem: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    conditions: z.array(z.unknown()),
    actions: z.array(z.unknown()),
    executions: z.array(z.unknown()),
    tags: z.array(z.unknown())
}).strict();

export type WorkflowTemplatePureType = z.infer<typeof WorkflowTemplateModelSchema>;
