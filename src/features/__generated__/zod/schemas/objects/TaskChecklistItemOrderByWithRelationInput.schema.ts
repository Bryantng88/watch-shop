import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './TaskOrderByWithRelationInput.schema';
import { TaskExecutionOrderByRelationAggregateInputObjectSchema as TaskExecutionOrderByRelationAggregateInputObjectSchema } from './TaskExecutionOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemOrderByWithRelationInput>;
export const TaskChecklistItemOrderByWithRelationInputObjectZodSchema = makeSchema();
