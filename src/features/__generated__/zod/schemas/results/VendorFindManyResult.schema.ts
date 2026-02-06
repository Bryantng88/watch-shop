import * as z from 'zod';
export const VendorFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  role: z.unknown(),
  isAuthorized: z.boolean(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bankName: z.string().optional(),
  bankAcc: z.string().optional(),
  isActive: z.boolean(),
  acquisitions: z.array(z.unknown()),
  invoice: z.array(z.unknown()),
  services: z.array(z.unknown()),
  Product: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown()),
  Bank: z.unknown().optional()
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