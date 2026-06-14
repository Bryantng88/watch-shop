import * as z from 'zod';
export const ServiceCatalogUpsertResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  defaultPrice: z.number().optional(),
  durationMin: z.number().int().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  detail: z.unknown(),
  vendorPrice: z.number().optional(),
  customerPrice: z.number().optional(),
  internalCost: z.number().optional(),
  note: z.string().optional(),
  categoryKey: z.string().optional(),
  sortOrder: z.number().int(),
  maintenanceRecord: z.array(z.unknown()),
  orderItem: z.array(z.unknown()),
  serviceRequest: z.array(z.unknown()),
  technicalIssue: z.array(z.unknown()),
  taskAction: z.array(z.unknown())
});