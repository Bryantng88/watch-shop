import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemActivityReplyCountOrderByAggregateInputObjectSchema as TaskItemActivityReplyCountOrderByAggregateInputObjectSchema } from './TaskItemActivityReplyCountOrderByAggregateInput.schema';
import { TaskItemActivityReplyMaxOrderByAggregateInputObjectSchema as TaskItemActivityReplyMaxOrderByAggregateInputObjectSchema } from './TaskItemActivityReplyMaxOrderByAggregateInput.schema';
import { TaskItemActivityReplyMinOrderByAggregateInputObjectSchema as TaskItemActivityReplyMinOrderByAggregateInputObjectSchema } from './TaskItemActivityReplyMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  activityId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  body: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TaskItemActivityReplyCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskItemActivityReplyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskItemActivityReplyMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyOrderByWithAggregationInput>;
export const TaskItemActivityReplyOrderByWithAggregationInputObjectZodSchema = makeSchema();
