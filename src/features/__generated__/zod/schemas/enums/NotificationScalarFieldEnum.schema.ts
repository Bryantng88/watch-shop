import * as z from 'zod';

export const NotificationScalarFieldEnumSchema = z.enum(['id', 'type', 'title', 'message', 'priority', 'isRead', 'userId', 'taskId', 'metadata', 'createdAt', 'updatedAt'])

export type NotificationScalarFieldEnum = z.infer<typeof NotificationScalarFieldEnumSchema>;