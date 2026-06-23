import * as z from 'zod';

// prettier-ignore
export const TaskItemChecklistModelSchema = z.object({
    id: z.string(),
    taskItemId: z.string(),
    title: z.string(),
    note: z.string().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    doneAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskItem: z.unknown(),
    Task: z.unknown().nullable(),
    taskId: z.string().nullable()
}).strict();

export type TaskItemChecklistPureType = z.infer<typeof TaskItemChecklistModelSchema>;
