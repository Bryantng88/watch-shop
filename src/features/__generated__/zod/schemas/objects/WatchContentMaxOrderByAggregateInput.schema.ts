import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  titleOverride: SortOrderSchema.optional(),
  summary: SortOrderSchema.optional(),
  hookText: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  seoTitle: SortOrderSchema.optional(),
  seoDescription: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchContentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchContentMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentMaxOrderByAggregateInput>;
export const WatchContentMaxOrderByAggregateInputObjectZodSchema = makeSchema();
