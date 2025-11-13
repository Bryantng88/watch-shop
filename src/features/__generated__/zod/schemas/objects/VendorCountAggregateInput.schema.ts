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
  _all: z.literal(true).optional()
}).strict();
export const VendorCountAggregateInputObjectSchema: z.ZodType<Prisma.VendorCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.VendorCountAggregateInputType>;
export const VendorCountAggregateInputObjectZodSchema = makeSchema();
