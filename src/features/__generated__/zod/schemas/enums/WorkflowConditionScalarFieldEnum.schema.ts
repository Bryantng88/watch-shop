import * as z from 'zod';

export const WorkflowConditionScalarFieldEnumSchema = z.enum(['id', 'workflowId', 'eventKey', 'targetType', 'sortOrder', 'configJson', 'createdAt', 'updatedAt'])

export type WorkflowConditionScalarFieldEnum = z.infer<typeof WorkflowConditionScalarFieldEnumSchema>;