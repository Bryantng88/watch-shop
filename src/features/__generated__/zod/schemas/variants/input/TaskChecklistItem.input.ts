import * as z from 'zod';

// prettier-ignore
export const TaskChecklistItemInputSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    title: z.string(),
    note: z.string().optional().nullable(),
    isDone: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    task: z.unknown(),
    executions: z.array(z.unknown())
}).strict();

export type TaskChecklistItemInputType = z.infer<typeof TaskChecklistItemInputSchema>;
