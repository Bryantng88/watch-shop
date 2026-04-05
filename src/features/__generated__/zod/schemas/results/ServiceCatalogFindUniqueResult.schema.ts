import * as z from 'zod';
export const ServiceCatalogFindUniqueResultSchema = z.nullable(z.object({
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
  MaintenanceRecord: z.array(z.unknown()),
  OrderItem: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown()),
  TechnicalIssue: z.array(z.unknown())
}));