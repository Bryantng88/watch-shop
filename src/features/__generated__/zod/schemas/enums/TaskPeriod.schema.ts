import * as z from 'zod';

export const TaskPeriodSchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])

export type TaskPeriod = z.infer<typeof TaskPeriodSchema>;