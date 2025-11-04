import * as z from 'zod';
export const VendorCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.unknown(),
  isAuthorized: z.boolean(),
  email: z.string().optional(),
  phone: z.string(),
  address: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  acquisitions: z.array(z.unknown()),
  invoice: z.array(z.unknown()),
  services: z.array(z.unknown()),
  Product: z.array(z.unknown())
});