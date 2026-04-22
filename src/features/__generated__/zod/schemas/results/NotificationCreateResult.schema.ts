import * as z from 'zod';
export const NotificationCreateResultSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string(),
  isRead: z.boolean(),
  userId: z.string(),
  metadata: z.unknown().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  user: z.unknown()
});