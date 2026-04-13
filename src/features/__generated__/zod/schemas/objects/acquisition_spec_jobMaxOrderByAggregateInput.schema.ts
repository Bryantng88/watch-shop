import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisition_item_id: SortOrderSchema.optional(),
  product_id: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  last_error: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  run_after: SortOrderSchema.optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const acquisition_spec_jobMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobMaxOrderByAggregateInput>;
export const acquisition_spec_jobMaxOrderByAggregateInputObjectZodSchema = makeSchema();
