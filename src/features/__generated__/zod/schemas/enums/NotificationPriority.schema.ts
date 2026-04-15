import * as z from 'zod';

export const NotificationPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH'])

export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;