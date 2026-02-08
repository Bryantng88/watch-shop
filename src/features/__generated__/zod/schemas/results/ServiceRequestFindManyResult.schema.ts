import * as z from 'zod';
export const ServiceRequestFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  type: z.unknown(),
  billable: z.boolean(),
  orderItemId: z.string().optional(),
  customerId: z.string().optional(),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  brandSnapshot: z.string().optional(),
  modelSnapshot: z.string().optional(),
  refSnapshot: z.string().optional(),
  serialSnapshot: z.string().optional(),
  appointmentAt: z.date().optional(),
  status: z.unknown(),
  notes: z.string().optional(),
  warrantyUntil: z.date().optional(),
  warrantyPolicy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  servicecatalogid: z.string().optional(),
  refNo: z.string().optional(),
  scope: z.unknown().optional(),
  Invoice: z.array(z.unknown()),
  maintenance: z.array(z.unknown()),
  customer: z.unknown().optional(),
  orderItem: z.unknown().optional(),
  product: z.unknown().optional(),
  variant: z.unknown().optional(),
  ServiceCatalog: z.unknown().optional()
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