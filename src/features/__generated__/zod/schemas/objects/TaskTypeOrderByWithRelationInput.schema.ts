import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { TaskActionOrderByRelationAggregateInputObjectSchema as TaskActionOrderByRelationAggregateInputObjectSchema } from './TaskActionOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  domain: SortOrderSchema.optional(),
  defaultPriority: SortOrderSchema.optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  taskAction: z.lazy(() => TaskActionOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TaskTypeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskTypeOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeOrderByWithRelationInput>;
export const TaskTypeOrderByWithRelationInputObjectZodSchema = makeSchema();
