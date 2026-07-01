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
export const TaskItemActivityReplyMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyMinOrderByAggregateInput>;
export const TaskItemActivityReplyMinOrderByAggregateInputObjectZodSchema = makeSchema();
