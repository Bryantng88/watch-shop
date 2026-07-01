import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  activityId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskItemActivityReplyMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyMaxOrderByAggregateInput>;
export const TaskItemActivityReplyMaxOrderByAggregateInputObjectZodSchema = makeSchema();
