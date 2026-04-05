import * as z from 'zod';
export const technicalActionCatalogFindManyResultSchema = z.object({
  data: z.array(z.object({
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