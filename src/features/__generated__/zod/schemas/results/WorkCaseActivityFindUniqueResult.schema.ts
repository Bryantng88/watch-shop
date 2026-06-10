import * as z from 'zod';
export const WorkCaseActivityFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  workCaseId: z.string(),
  actorId: z.string().optional(),
  action: z.string(),
  note: z.string().optional(),
  metadata: z.unknown().optional(),
  createdAt: z.date(),
  workCase: z.unknown(),
  actor: z.unknown().optional()
}));