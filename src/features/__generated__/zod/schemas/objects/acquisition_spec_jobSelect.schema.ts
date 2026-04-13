import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  acquisition_item_id: z.boolean().optional(),
  product_id: z.boolean().optional(),
  status: z.boolean().optional(),
  attempts: z.boolean().optional(),
  last_error: z.boolean().optional(),
  priority: z.boolean().optional(),
  run_after: z.boolean().optional(),
  started_at: z.boolean().optional(),
  finished_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
export const acquisition_spec_jobSelectObjectSchema: z.ZodType<Prisma.acquisition_spec_jobSelect> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobSelect>;
export const acquisition_spec_jobSelectObjectZodSchema = makeSchema();
