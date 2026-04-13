import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisition_item_id: z.string(),
  product_id: z.string(),
  status: z.string().optional(),
  attempts: z.number().int().optional(),
  last_error: z.string().optional().nullable(),
  priority: z.number().int().optional(),
  run_after: z.coerce.date().optional(),
  started_at: z.coerce.date().optional().nullable(),
  finished_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();
export const acquisition_spec_jobUncheckedCreateInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobUncheckedCreateInput>;
export const acquisition_spec_jobUncheckedCreateInputObjectZodSchema = makeSchema();
