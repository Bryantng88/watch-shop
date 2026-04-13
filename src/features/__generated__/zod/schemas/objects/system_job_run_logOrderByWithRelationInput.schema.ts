import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processor_key: SortOrderSchema.optional(),
  trigger_source: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processed_count: SortOrderSchema.optional(),
  error_count: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const system_job_run_logOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.system_job_run_logOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logOrderByWithRelationInput>;
export const system_job_run_logOrderByWithRelationInputObjectZodSchema = makeSchema();
