import * as z from 'zod';

export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export type TaskPriority = z.infer<typeof TaskPrioritySchema>;