import * as z from 'zod';

export const TaskExecutionActionTypeSchema = z.enum(['CREATED', 'LINKED', 'UPDATED', 'CANCELLED'])

export type TaskExecutionActionType = z.infer<typeof TaskExecutionActionTypeSchema>;