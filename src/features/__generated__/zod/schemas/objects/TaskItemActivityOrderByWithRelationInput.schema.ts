import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemOrderByWithRelationInputObjectSchema as TaskItemOrderByWithRelationInputObjectSchema } from './TaskItemOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskItemActivityReplyOrderByRelationAggregateInputObjectSchema as TaskItemActivityReplyOrderByRelationAggregateInputObjectSchema } from './TaskItemActivityReplyOrderByRelationAggregateInput.schema'

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
  taskItem: z.lazy(() => TaskItemOrderByWithRelationInputObjectSchema).optional(),
  actorUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  replies: z.lazy(() => TaskItemActivityReplyOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TaskItemActivityOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskItemActivityOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityOrderByWithRelationInput>;
export const TaskItemActivityOrderByWithRelationInputObjectZodSchema = makeSchema();
