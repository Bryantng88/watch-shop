import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './TaskOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskExecutionOrderByRelationAggregateInputObjectSchema as TaskExecutionOrderByRelationAggregateInputObjectSchema } from './TaskExecutionOrderByRelationAggregateInput.schema';
import { TaskItemChecklistOrderByRelationAggregateInputObjectSchema as TaskItemChecklistOrderByRelationAggregateInputObjectSchema } from './TaskItemChecklistOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  dueAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedToUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionOrderByRelationAggregateInputObjectSchema).optional(),
  checklists: z.lazy(() => TaskItemChecklistOrderByRelationAggregateInputObjectSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TaskItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemOrderByWithRelationInput>;
export const TaskItemOrderByWithRelationInputObjectZodSchema = makeSchema();
