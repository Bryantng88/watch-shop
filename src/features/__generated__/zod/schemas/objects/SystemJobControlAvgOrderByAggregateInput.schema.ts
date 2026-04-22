import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  batchSize: SortOrderSchema.optional()
}).strict();
export const SystemJobControlAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlAvgOrderByAggregateInput>;
export const SystemJobControlAvgOrderByAggregateInputObjectZodSchema = makeSchema();
