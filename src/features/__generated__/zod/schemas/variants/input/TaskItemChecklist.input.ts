import * as z from 'zod';

// prettier-ignore
export const TaskItemChecklistInputSchema = z.object({
    id: z.string(),
    taskItemId: z.string(),
    title: z.string(),
    note: z.string().optional().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    doneAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskItem: z.unknown(),
    Task: z.unknown().optional().nullable(),
    taskId: z.string().optional().nullable()
}).strict();

export type TaskItemChecklistInputType = z.infer<typeof TaskItemChecklistInputSchema>;
