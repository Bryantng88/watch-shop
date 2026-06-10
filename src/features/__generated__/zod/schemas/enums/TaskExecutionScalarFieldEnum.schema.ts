import * as z from 'zod';

export const TaskExecutionScalarFieldEnumSchema = z.enum(['id', 'taskId', 'targetType', 'targetId', 'actionType', 'note', 'createdByUserId', 'createdAt'])

export type TaskExecutionScalarFieldEnum = z.infer<typeof TaskExecutionScalarFieldEnumSchema>;