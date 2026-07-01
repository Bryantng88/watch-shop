import * as z from 'zod';

export const TaskItemActivityReplyScalarFieldEnumSchema = z.enum(['id', 'activityId', 'actorUserId', 'body', 'metadataJson', 'createdAt', 'updatedAt'])

export type TaskItemActivityReplyScalarFieldEnum = z.infer<typeof TaskItemActivityReplyScalarFieldEnumSchema>;