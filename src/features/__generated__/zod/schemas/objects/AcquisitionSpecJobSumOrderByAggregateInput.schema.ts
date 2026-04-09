import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const AcquisitionSpecJobSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobSumOrderByAggregateInput>;
export const AcquisitionSpecJobSumOrderByAggregateInputObjectZodSchema = makeSchema();
