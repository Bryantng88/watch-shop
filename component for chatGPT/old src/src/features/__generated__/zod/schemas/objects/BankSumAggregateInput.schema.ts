import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional()
}).strict();
export const BankSumAggregateInputObjectSchema: z.ZodType<Prisma.BankSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BankSumAggregateInputType>;
export const BankSumAggregateInputObjectZodSchema = makeSchema();
