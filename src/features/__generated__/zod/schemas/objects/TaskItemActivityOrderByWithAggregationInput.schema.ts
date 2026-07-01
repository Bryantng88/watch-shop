import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemActivityCountOrderByAggregateInputObjectSchema as TaskItemActivityCountOrderByAggregateInputObjectSchema } from './TaskItemActivityCountOrderByAggregateInput.schema';
import { TaskItemActivityMaxOrderByAggregateInputObjectSchema as TaskItemActivityMaxOrderByAggregateInputObjectSchema } from './TaskItemActivityMaxOrderByAggregateInput.schema';
import { TaskItemActivityMinOrderByAggregateInputObjectSchema as TaskItemActivityMinOrderByAggregateInputObjectSchema } from './TaskItemActivityMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskItemId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  sourceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  body: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  occurredAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TaskItemActivityCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskItemActivityMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskItemActivityMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskItemActivityOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskItemActivityOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityOrderByWithAggregationInput>;
export const TaskItemActivityOrderByWithAggregationInputObjectZodSchema = makeSchema();
