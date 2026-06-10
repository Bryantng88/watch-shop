import * as z from 'zod';
export const WorkCaseCategoryFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  scope: z.unknown(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workCases: z.array(z.unknown())
}));