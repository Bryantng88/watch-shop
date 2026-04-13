import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batch_size: SortOrderSchema.optional(),
  paused_reason: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  updated_by: SortOrderSchema.optional()
}).strict();
export const system_job_controlMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_controlMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlMaxOrderByAggregateInput>;
export const system_job_controlMaxOrderByAggregateInputObjectZodSchema = makeSchema();
