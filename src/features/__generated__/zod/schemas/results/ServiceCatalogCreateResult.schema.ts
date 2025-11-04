import * as z from 'zod';
export const ServiceCatalogCreateResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  defaultPrice: z.number().optional(),
  durationMin: z.number().int().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  maintenanceRecordId: z.string().optional(),
  maintenanceRecord: z.unknown().optional()
});