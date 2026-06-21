import * as z from 'zod';

export const TaskChecklistItemScalarFieldEnumSchema = z.enum(['id', 'taskId', 'title', 'note', 'status', 'priority', 'dueAt', 'assignedToUserId', 'startedAt', 'completedAt', 'cancelledAt', 'isDone', 'sortOrder', 'createdAt', 'updatedAt', 'userId'])

export type TaskChecklistItemScalarFieldEnum = z.infer<typeof TaskChecklistItemScalarFieldEnumSchema>;