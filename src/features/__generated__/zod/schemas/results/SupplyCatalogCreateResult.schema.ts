import * as z from 'zod';
export const SupplyCatalogCreateResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: z.string(),
  unit: z.string().optional(),
  defaultCost: z.number().optional(),
  note: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  TechnicalIssue: z.array(z.unknown())
});