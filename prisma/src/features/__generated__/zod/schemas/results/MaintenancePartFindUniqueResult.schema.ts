import * as z from 'zod';
export const MaintenancePartFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  recordId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  quantity: z.number().int(),
  unitCost: z.number().optional(),
  notes: z.string().optional(),
  record: z.unknown(),
  variant: z.unknown().optional()
}));