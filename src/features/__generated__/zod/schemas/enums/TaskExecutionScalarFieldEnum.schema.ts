import * as z from 'zod';

export const TaskExecutionScalarFieldEnumSchema = z.enum(['id', 'taskId', 'targetType', 'targetId', 'actionType', 'metadataJson', 'note', 'createdByUserId', 'createdAt', 'checklistItemId'])

export type TaskExecutionScalarFieldEnum = z.infer<typeof TaskExecutionScalarFieldEnumSchema>;