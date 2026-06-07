import * as z from 'zod';

export const TaskSourceSchema = z.enum(['MANUAL', 'SYSTEM'])

export type TaskSource = z.infer<typeof TaskSourceSchema>;