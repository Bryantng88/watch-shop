import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const acquisition_spec_jobAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobAvgOrderByAggregateInput>;
export const acquisition_spec_jobAvgOrderByAggregateInputObjectZodSchema = makeSchema();
