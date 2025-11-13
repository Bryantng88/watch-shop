import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  bankName: z.literal(true).optional()
}).strict();
export const BankMaxAggregateInputObjectSchema: z.ZodType<Prisma.BankMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BankMaxAggregateInputType>;
export const BankMaxAggregateInputObjectZodSchema = makeSchema();
