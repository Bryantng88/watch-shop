import * as z from 'zod';
export const NotificationUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string(),
  isRead: z.boolean(),
  userId: z.string(),
  metadata: z.unknown().optional(),
  createdAt: z.date().optional(),
  User: z.unknown()
}));