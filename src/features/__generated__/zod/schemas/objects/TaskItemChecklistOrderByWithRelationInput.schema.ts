import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemOrderByWithRelationInputObjectSchema as TaskItemOrderByWithRelationInputObjectSchema } from './TaskItemOrderByWithRelationInput.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './TaskOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskItemId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  doneAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  taskId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  taskItem: z.lazy(() => TaskItemOrderByWithRelationInputObjectSchema).optional(),
  Task: z.lazy(() => TaskOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TaskItemChecklistOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistOrderByWithRelationInput>;
export const TaskItemChecklistOrderByWithRelationInputObjectZodSchema = makeSchema();
