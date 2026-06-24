import * as z from 'zod';

export const TaskExecutionScalarFieldEnumSchema = z.enum(['id', 'taskId', 'targetType', 'targetId', 'actionType', 'metadataJson', 'note', 'createdByUserId', 'createdAt', 'serviceRequestId', 'technicalIssueId', 'taskItemId'])

export type TaskExecutionScalarFieldEnum = z.infer<typeof TaskExecutionScalarFieldEnumSchema>;