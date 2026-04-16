import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  bankName: SortOrderSchema.optional()
}).strict();
export const BankMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BankMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankMinOrderByAggregateInput>;
export const BankMinOrderByAggregateInputObjectZodSchema = makeSchema();
