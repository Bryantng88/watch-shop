import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  acquisition_item_id: z.literal(true).optional(),
  product_id: z.literal(true).optional(),
  status: z.literal(true).optional(),
  attempts: z.literal(true).optional(),
  last_error: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  run_after: z.literal(true).optional(),
  started_at: z.literal(true).optional(),
  finished_at: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Acquisition_spec_jobMaxAggregateInputObjectSchema: z.ZodType<Prisma.Acquisition_spec_jobMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.Acquisition_spec_jobMaxAggregateInputType>;
export const Acquisition_spec_jobMaxAggregateInputObjectZodSchema = makeSchema();
