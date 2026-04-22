import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batchSize: SortOrderSchema.optional(),
  pausedReason: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  updated_by: SortOrderSchema.optional()
}).strict();
export const SystemJobControlCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlCountOrderByAggregateInput>;
export const SystemJobControlCountOrderByAggregateInputObjectZodSchema = makeSchema();
