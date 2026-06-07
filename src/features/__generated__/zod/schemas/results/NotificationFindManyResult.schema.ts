import * as z from 'zod';
export const NotificationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string(),
  isRead: z.boolean(),
  userId: z.string(),
  taskId: z.string().optional(),
  metadata: z.unknown().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  user: z.unknown(),
  task: z.unknown().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});