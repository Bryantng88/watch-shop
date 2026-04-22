import * as z from 'zod';
export const NotificationGroupByResultSchema = z.array(z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string(),
  isRead: z.boolean(),
  userId: z.string(),
  metadata: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    type: z.number(),
    title: z.number(),
    message: z.number(),
    priority: z.number(),
    isRead: z.number(),
    userId: z.number(),
    metadata: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    user: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    title: z.string().nullable(),
    message: z.string().nullable(),
    priority: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    title: z.string().nullable(),
    message: z.string().nullable(),
    priority: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));