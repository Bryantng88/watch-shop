import * as z from 'zod';

export const NotificationChannelDeliveryScalarFieldEnumSchema = z.enum(['id', 'dispatchId', 'channel', 'recipientGroupKey', 'status', 'errorMessage', 'payloadJson', 'sentAt', 'createdAt', 'updatedAt'])

export type NotificationChannelDeliveryScalarFieldEnum = z.infer<typeof NotificationChannelDeliveryScalarFieldEnumSchema>;