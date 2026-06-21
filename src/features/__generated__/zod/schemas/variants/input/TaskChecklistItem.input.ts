import * as z from 'zod';

import { TaskStatusSchema } from '../../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const TaskChecklistItemInputSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    title: z.string(),
    note: z.string().optional().nullable(),
    status: TaskStatusSchema,
    priority: TaskPrioritySchema,
    dueAt: z.date().optional().nullable(),
    assignedToUserId: z.string().optional().nullable(),
    startedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    cancelledAt: z.date().optional().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    task: z.unknown(),
    assignedToUser: z.unknown().optional().nullable(),
    executions: z.array(z.unknown()),
    User: z.unknown().optional().nullable(),
    userId: z.string().optional().nullable()
}).strict();

export type TaskChecklistItemInputType = z.infer<typeof TaskChecklistItemInputSchema>;
