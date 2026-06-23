import * as z from 'zod';

import { TaskStatusSchema } from '../../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const TaskItemResultSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    title: z.string(),
    note: z.string().nullable(),
    status: TaskStatusSchema,
    priority: TaskPrioritySchema,
    dueAt: z.date().nullable(),
    assignedToUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    cancelledAt: z.date().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    task: z.unknown(),
    assignedToUser: z.unknown().nullable(),
    executions: z.array(z.unknown()),
    checklists: z.array(z.unknown()),
    userId: z.string().nullable(),
    User: z.unknown().nullable()
}).strict();

export type TaskItemResultType = z.infer<typeof TaskItemResultSchema>;
