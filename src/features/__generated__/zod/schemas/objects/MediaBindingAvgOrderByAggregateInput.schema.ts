import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const MediaBindingAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingAvgOrderByAggregateInput>;
export const MediaBindingAvgOrderByAggregateInputObjectZodSchema = makeSchema();
