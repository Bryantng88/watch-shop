import * as z from 'zod';

export const WorkflowExecutionEventScalarFieldEnumSchema = z.enum(['id', 'executionId', 'targetType', 'targetId', 'eventKey', 'eventLogId', 'createdAt'])

export type WorkflowExecutionEventScalarFieldEnum = z.infer<typeof WorkflowExecutionEventScalarFieldEnumSchema>;