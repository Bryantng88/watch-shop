import * as z from 'zod';
export const technicalActionCatalogUpsertResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  appliesTo: z.string(),
  groupKey: z.string(),
  requiresPart: z.boolean(),
  defaultExecutionMode: z.string().optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});