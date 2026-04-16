import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  role: z.literal(true).optional(),
  isAuthorized: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  address: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  bankName: z.literal(true).optional(),
  bankAcc: z.literal(true).optional(),
  isActive: z.literal(true).optional()
}).strict();
export const VendorMinAggregateInputObjectSchema: z.ZodType<Prisma.VendorMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.VendorMinAggregateInputType>;
export const VendorMinAggregateInputObjectZodSchema = makeSchema();
