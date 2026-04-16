import * as z from 'zod';

export const NotificationTypeSchema = z.enum(['PRODUCT_PRICE_UPDATED', 'PRODUCT_IN_SERVICE', 'PRODUCT_SERVICE_DONE', 'PRODUCT_READY_FOR_POST'])

export type NotificationType = z.infer<typeof NotificationTypeSchema>;