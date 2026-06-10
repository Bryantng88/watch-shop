import * as z from 'zod';
export const WorkCaseActivityFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  workCaseId: z.string(),
  actorId: z.string().optional(),
  action: z.string(),
  note: z.string().optional(),
  metadata: z.unknown().optional(),
  createdAt: z.date(),
  workCase: z.unknown(),
  actor: z.unknown().optional()
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