import * as z from 'zod';
export const CustomerDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  ward: z.string().optional(),
  city: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  Acquisition: z.array(z.unknown()),
  user: z.unknown().optional(),
  Invoice: z.array(z.unknown()),
  orders: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown())
}));