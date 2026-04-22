import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batchSize: SortOrderSchema.optional(),
  pausedReason: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  updatedBy: SortOrderSchema.optional()
}).strict();
export const SystemJobControlMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlMaxOrderByAggregateInput>;
export const SystemJobControlMaxOrderByAggregateInputObjectZodSchema = makeSchema();
