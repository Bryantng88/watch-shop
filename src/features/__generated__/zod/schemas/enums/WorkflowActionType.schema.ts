import * as z from 'zod';

export const WorkflowActionTypeSchema = z.enum(['COMPLETE_TASK_ITEM'])

export type WorkflowActionType = z.infer<typeof WorkflowActionTypeSchema>;