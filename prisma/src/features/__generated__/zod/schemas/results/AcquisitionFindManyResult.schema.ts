import * as z from 'zod';
export const AcquisitionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  vendorId: z.string().optional(),
  customerId: z.string().optional(),
  type: z.unknown(),
  acquiredAt: z.date(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  payoutStatus: z.string().optional(),
  refNo: z.string().optional(),
  notes: z.string().optional(),
  condition: z.string().optional(),
  warrantyUntil: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customer: z.unknown().optional(),
  vendor: z.unknown().optional(),
  AcquisitionItem: z.array(z.unknown()),
  Invoice: z.array(z.unknown())
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