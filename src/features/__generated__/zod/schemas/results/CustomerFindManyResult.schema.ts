import * as z from 'zod';
export const CustomerFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  ward: z.string().optional(),
  city: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  address: z.string().optional(),
  district: z.string().optional(),
  Acquisition: z.array(z.unknown()),
  user: z.unknown().optional(),
  Invoice: z.array(z.unknown()),
  orders: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown())
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