import * as z from 'zod';

export const NotificationDispatchScalarFieldEnumSchema = z.enum(['id', 'businessEventLogId', 'ruleId', 'eventKey', 'targetType', 'targetId', 'status', 'errorMessage', 'payloadJson', 'createdAt', 'updatedAt'])

export type NotificationDispatchScalarFieldEnum = z.infer<typeof NotificationDispatchScalarFieldEnumSchema>;