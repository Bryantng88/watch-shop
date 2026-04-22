import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  batchSize: SortOrderSchema.optional()
}).strict();
export const SystemJobControlSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlSumOrderByAggregateInput>;
export const SystemJobControlSumOrderByAggregateInputObjectZodSchema = makeSchema();
