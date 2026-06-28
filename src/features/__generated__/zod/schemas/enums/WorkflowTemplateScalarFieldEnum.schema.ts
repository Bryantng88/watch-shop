import * as z from 'zod';

export const WorkflowTemplateScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'status', 'strategy', 'ownerType', 'ownerId', 'isSystem', 'createdAt', 'updatedAt'])

export type WorkflowTemplateScalarFieldEnum = z.infer<typeof WorkflowTemplateScalarFieldEnumSchema>;