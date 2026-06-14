import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { TaskCreateNestedManyWithoutTaskTypeInputObjectSchema as TaskCreateNestedManyWithoutTaskTypeInputObjectSchema } from './TaskCreateNestedManyWithoutTaskTypeInput.schema';
import { TaskActionCreateNestedManyWithoutTaskTypeInputObjectSchema as TaskActionCreateNestedManyWithoutTaskTypeInputObjectSchema } from './TaskActionCreateNestedManyWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  domain: TaskDomainSchema.optional(),
  defaultPriority: TaskPrioritySchema.optional(),
  completionMode: TaskCompletionModeSchema.optional(),
  completionRuleKey: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutTaskTypeInputObjectSchema),
  taskAction: z.lazy(() => TaskActionCreateNestedManyWithoutTaskTypeInputObjectSchema)
}).strict();
export const TaskTypeCreateInputObjectSchema: z.ZodType<Prisma.TaskTypeCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCreateInput>;
export const TaskTypeCreateInputObjectZodSchema = makeSchema();
