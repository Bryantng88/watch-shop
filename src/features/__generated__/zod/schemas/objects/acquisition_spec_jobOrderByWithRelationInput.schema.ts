import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisition_item_id: SortOrderSchema.optional(),
  product_id: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  last_error: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  priority: SortOrderSchema.optional(),
  run_after: SortOrderSchema.optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const acquisition_spec_jobOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobOrderByWithRelationInput>;
export const acquisition_spec_jobOrderByWithRelationInputObjectZodSchema = makeSchema();
