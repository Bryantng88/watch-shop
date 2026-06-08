import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskTypeSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeSumOrderByAggregateInput>;
export const TaskTypeSumOrderByAggregateInputObjectZodSchema = makeSchema();
