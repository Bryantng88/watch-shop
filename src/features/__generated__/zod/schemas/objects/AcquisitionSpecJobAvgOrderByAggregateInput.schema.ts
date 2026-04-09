import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const AcquisitionSpecJobAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobAvgOrderByAggregateInput>;
export const AcquisitionSpecJobAvgOrderByAggregateInputObjectZodSchema = makeSchema();
