import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  bankName: SortOrderSchema.optional()
}).strict();
export const BankMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BankMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankMaxOrderByAggregateInput>;
export const BankMaxOrderByAggregateInputObjectZodSchema = makeSchema();
