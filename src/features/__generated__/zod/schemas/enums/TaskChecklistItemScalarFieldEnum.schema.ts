import * as z from 'zod';

export const TaskChecklistItemScalarFieldEnumSchema = z.enum(['id', 'taskId', 'title', 'note', 'isDone', 'sortOrder', 'createdAt', 'updatedAt'])

export type TaskChecklistItemScalarFieldEnum = z.infer<typeof TaskChecklistItemScalarFieldEnumSchema>;