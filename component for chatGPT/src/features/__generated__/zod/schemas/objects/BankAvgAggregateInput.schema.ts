import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional()
}).strict();
export const BankAvgAggregateInputObjectSchema: z.ZodType<Prisma.BankAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BankAvgAggregateInputType>;
export const BankAvgAggregateInputObjectZodSchema = makeSchema();
