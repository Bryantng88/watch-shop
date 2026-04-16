import * as z from 'zod';
export const ServiceCatalogFindManyResultSchema = z.object({
  data: z.array(z.object({
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