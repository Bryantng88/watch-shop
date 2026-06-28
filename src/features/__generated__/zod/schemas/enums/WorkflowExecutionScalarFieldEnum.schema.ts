import * as z from 'zod';

export const WorkflowExecutionScalarFieldEnumSchema = z.enum(['id', 'workflowId', 'actionTargetType', 'actionTargetId', 'status', 'errorMessage', 'metadataJson', 'startedAt', 'completedAt', 'failedAt', 'createdAt', 'updatedAt'])

export type WorkflowExecutionScalarFieldEnum = z.infer<typeof WorkflowExecutionScalarFieldEnumSchema>;