import * as z from 'zod';

export const TaskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'])

export type TaskStatus = z.infer<typeof TaskStatusSchema>;