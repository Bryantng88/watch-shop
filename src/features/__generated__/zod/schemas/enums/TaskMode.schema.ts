import * as z from 'zod';

export const TaskModeSchema = z.enum(['NORMAL', 'APPROVAL', 'EXCEPTION', 'FOLLOW_UP', 'INVESTIGATION'])

export type TaskMode = z.infer<typeof TaskModeSchema>;