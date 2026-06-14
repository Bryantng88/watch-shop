import * as z from 'zod';

import { TaskDomainSchema } from '../../enums/TaskDomain.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
import { TaskCompletionModeSchema } from '../../enums/TaskCompletionMode.schema';
// prettier-ignore
export const TaskTypeInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    domain: TaskDomainSchema,
    defaultPriority: TaskPrioritySchema,
    completionMode: TaskCompletionModeSchema,
    completionRuleKey: z.string().optional().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tasks: z.array(z.unknown()),
    taskAction: z.array(z.unknown())
}).strict();

export type TaskTypeInputType = z.infer<typeof TaskTypeInputSchema>;
