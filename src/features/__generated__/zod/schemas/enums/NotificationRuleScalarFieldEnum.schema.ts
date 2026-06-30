import * as z from 'zod';

export const NotificationRuleScalarFieldEnumSchema = z.enum(['id', 'name', 'eventKey', 'enabled', 'channel', 'recipientGroupKey', 'conditionJson', 'titleTemplate', 'messageTemplate', 'priority', 'createdAt', 'updatedAt'])

export type NotificationRuleScalarFieldEnum = z.infer<typeof NotificationRuleScalarFieldEnumSchema>;