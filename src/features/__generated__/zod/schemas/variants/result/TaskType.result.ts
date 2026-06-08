import * as z from 'zod';

import { TaskDomainSchema } from '../../enums/TaskDomain.schema';
import { TaskKindSchema } from '../../enums/TaskKind.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
import { TaskCompletionModeSchema } from '../../enums/TaskCompletionMode.schema';
// prettier-ignore
export const TaskTypeResultSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    domain: TaskDomainSchema,
    legacyKind: TaskKindSchema,
    defaultPriority: TaskPrioritySchema,
    completionMode: TaskCompletionModeSchema,
    completionRuleKey: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tasks: z.array(z.unknown())
}).strict();

export type TaskTypeResultType = z.infer<typeof TaskTypeResultSchema>;
