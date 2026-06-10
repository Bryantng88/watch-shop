import * as z from 'zod';

export const TaskCompletionModeSchema = z.enum(['MANUAL_CONFIRM', 'BUSINESS_RULE'])

export type TaskCompletionMode = z.infer<typeof TaskCompletionModeSchema>;