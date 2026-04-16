import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BankCountOrderByAggregateInputObjectSchema as BankCountOrderByAggregateInputObjectSchema } from './BankCountOrderByAggregateInput.schema';
import { BankAvgOrderByAggregateInputObjectSchema as BankAvgOrderByAggregateInputObjectSchema } from './BankAvgOrderByAggregateInput.schema';
import { BankMaxOrderByAggregateInputObjectSchema as BankMaxOrderByAggregateInputObjectSchema } from './BankMaxOrderByAggregateInput.schema';
import { BankMinOrderByAggregateInputObjectSchema as BankMinOrderByAggregateInputObjectSchema } from './BankMinOrderByAggregateInput.schema';
import { BankSumOrderByAggregateInputObjectSchema as BankSumOrderByAggregateInputObjectSchema } from './BankSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  bankName: SortOrderSchema.optional(),
  _count: z.lazy(() => BankCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BankAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BankMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BankMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BankSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BankOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BankOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BankOrderByWithAggregationInput>;
export const BankOrderByWithAggregationInputObjectZodSchema = makeSchema();
