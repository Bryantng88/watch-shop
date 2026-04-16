import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional()
}).strict();
export const WatchMediaSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchMediaSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaSumOrderByAggregateInput>;
export const WatchMediaSumOrderByAggregateInputObjectZodSchema = makeSchema();
