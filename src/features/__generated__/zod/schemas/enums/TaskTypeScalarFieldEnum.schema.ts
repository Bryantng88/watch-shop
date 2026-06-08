import * as z from 'zod';

export const TaskTypeScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'description', 'domain', 'legacyKind', 'defaultPriority', 'completionMode', 'completionRuleKey', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type TaskTypeScalarFieldEnum = z.infer<typeof TaskTypeScalarFieldEnumSchema>;