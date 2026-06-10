import * as z from 'zod';
export const WorkCaseFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  refNo: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  scope: z.unknown(),
  status: z.unknown(),
  priority: z.unknown(),
  watchId: z.string(),
  categoryId: z.string().optional(),
  raisedByUserId: z.string().optional(),
  assignedToUserId: z.string().optional(),
  triagedAt: z.date().optional(),
  resolvedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown(),
  category: z.unknown().optional(),
  raisedByUser: z.unknown().optional(),
  assignedToUser: z.unknown().optional(),
  tasks: z.array(z.unknown()),
  serviceRequests: z.array(z.unknown()),
  activities: z.array(z.unknown())
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