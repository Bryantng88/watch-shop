import * as z from 'zod';
export const MechanicalPartCatalogDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  group: z.unknown(),
  defaultCost: z.number().optional(),
  note: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  TechnicalIssue: z.array(z.unknown())
}));