import * as z from 'zod';
export const CustomerFindUniqueResultSchema = z.nullable(z.object({
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
  acquisition: z.array(z.unknown()),
  user: z.unknown().optional(),
  Invoice: z.array(z.unknown()),
  order: z.array(z.unknown()),
  serviceRequest: z.array(z.unknown())
}));