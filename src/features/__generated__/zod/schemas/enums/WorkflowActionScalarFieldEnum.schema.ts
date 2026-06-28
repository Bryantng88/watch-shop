import * as z from 'zod';

export const WorkflowActionScalarFieldEnumSchema = z.enum(['id', 'workflowId', 'actionType', 'sortOrder', 'configJson', 'createdAt', 'updatedAt'])

export type WorkflowActionScalarFieldEnum = z.infer<typeof WorkflowActionScalarFieldEnumSchema>;