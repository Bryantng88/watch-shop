import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional()
}).strict();
export const BankAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BankAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankAvgOrderByAggregateInput>;
export const BankAvgOrderByAggregateInputObjectZodSchema = makeSchema();
