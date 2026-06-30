import * as z from 'zod';

export const TimelineContainerTypeSchema = z.enum(['TASK_ITEM'])

export type TimelineContainerType = z.infer<typeof TimelineContainerTypeSchema>;