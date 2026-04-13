import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  batch_size: SortOrderSchema.optional()
}).strict();
export const system_job_controlSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_controlSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlSumOrderByAggregateInput>;
export const system_job_controlSumOrderByAggregateInputObjectZodSchema = makeSchema();
