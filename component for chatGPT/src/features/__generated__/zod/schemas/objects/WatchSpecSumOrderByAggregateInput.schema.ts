import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  length: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  thickness: SortOrderSchema.optional(),
  goldKarat: SortOrderSchema.optional()
}).strict();
export const WatchSpecSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecSumOrderByAggregateInput>;
export const WatchSpecSumOrderByAggregateInputObjectZodSchema = makeSchema();
