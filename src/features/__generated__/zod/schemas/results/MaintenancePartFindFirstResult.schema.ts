import * as z from 'zod';
export const MaintenancePartFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  recordId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  quantity: z.number().int(),
  unitCost: z.number().optional(),
  notes: z.string().optional(),
  MaintenanceRecord: z.unknown(),
  ProductVariant: z.unknown().optional()
}));