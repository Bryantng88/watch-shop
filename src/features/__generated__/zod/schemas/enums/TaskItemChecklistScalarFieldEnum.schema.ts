import * as z from 'zod';

export const TaskItemChecklistScalarFieldEnumSchema = z.enum(['id', 'taskItemId', 'title', 'note', 'isDone', 'sortOrder', 'doneAt', 'createdAt', 'updatedAt', 'taskId'])

export type TaskItemChecklistScalarFieldEnum = z.infer<typeof TaskItemChecklistScalarFieldEnumSchema>;