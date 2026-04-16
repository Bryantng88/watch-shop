import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  cost: SortOrderSchema.optional()
}).strict();
export const AcquisitionAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionAvgOrderByAggregateInput>;
export const AcquisitionAvgOrderByAggregateInputObjectZodSchema = makeSchema();
