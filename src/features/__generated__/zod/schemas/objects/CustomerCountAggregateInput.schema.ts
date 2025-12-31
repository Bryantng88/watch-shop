import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  ward: z.literal(true).optional(),
  city: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  address: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CustomerCountAggregateInputObjectSchema: z.ZodType<Prisma.CustomerCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCountAggregateInputType>;
export const CustomerCountAggregateInputObjectZodSchema = makeSchema();
