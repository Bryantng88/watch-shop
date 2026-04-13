import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const acquisition_spec_jobSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobSumOrderByAggregateInput>;
export const acquisition_spec_jobSumOrderByAggregateInputObjectZodSchema = makeSchema();
