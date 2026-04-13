import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  batch_size: SortOrderSchema.optional()
}).strict();
export const system_job_controlAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_controlAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlAvgOrderByAggregateInput>;
export const system_job_controlAvgOrderByAggregateInputObjectZodSchema = makeSchema();
