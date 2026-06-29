import * as z from 'zod';

export const NotificationRecipientGroupScalarFieldEnumSchema = z.enum(['id', 'key', 'name', 'enabled', 'roleNames', 'userIds', 'zaloGroupId', 'createdAt', 'updatedAt'])

export type NotificationRecipientGroupScalarFieldEnum = z.infer<typeof NotificationRecipientGroupScalarFieldEnumSchema>;