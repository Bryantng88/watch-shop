import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  bankName: z.literal(true).optional()
}).strict();
export const BankMinAggregateInputObjectSchema: z.ZodType<Prisma.BankMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BankMinAggregateInputType>;
export const BankMinAggregateInputObjectZodSchema = makeSchema();
