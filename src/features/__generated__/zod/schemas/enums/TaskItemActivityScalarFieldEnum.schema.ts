import * as z from 'zod';

export const TaskItemActivityScalarFieldEnumSchema = z.enum(['id', 'taskItemId', 'sourceType', 'sourceId', 'title', 'body', 'status', 'actorUserId', 'metadataJson', 'occurredAt', 'createdAt', 'updatedAt'])

export type TaskItemActivityScalarFieldEnum = z.infer<typeof TaskItemActivityScalarFieldEnumSchema>;