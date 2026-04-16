import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional()
}).strict();
export const BankSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BankSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankSumOrderByAggregateInput>;
export const BankSumOrderByAggregateInputObjectZodSchema = makeSchema();
