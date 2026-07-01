import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskItemActivityReplyOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyOrderByRelationAggregateInput>;
export const TaskItemActivityReplyOrderByRelationAggregateInputObjectZodSchema = makeSchema();
