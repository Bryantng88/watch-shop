import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskActionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionOrderByRelationAggregateInput>;
export const TaskActionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
