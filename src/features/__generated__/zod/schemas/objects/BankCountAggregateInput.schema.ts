import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  bankName: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BankCountAggregateInputObjectSchema: z.ZodType<Prisma.BankCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BankCountAggregateInputType>;
export const BankCountAggregateInputObjectZodSchema = makeSchema();
