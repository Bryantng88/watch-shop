import * as z from 'zod';

// prettier-ignore
export const TaskChecklistItemResultSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    title: z.string(),
    note: z.string().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    task: z.unknown(),
    executions: z.array(z.unknown())
}).strict();

export type TaskChecklistItemResultType = z.infer<typeof TaskChecklistItemResultSchema>;
