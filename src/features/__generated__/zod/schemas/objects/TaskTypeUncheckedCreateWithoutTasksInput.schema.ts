import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { TaskActionUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema as TaskActionUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedCreateNestedManyWithoutTaskTypeInput.schema'

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
  updatedAt: z.coerce.date().optional(),
  taskAction: z.lazy(() => TaskActionUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema).optional()
}).strict();
export const TaskTypeUncheckedCreateWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskTypeUncheckedCreateWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUncheckedCreateWithoutTasksInput>;
export const TaskTypeUncheckedCreateWithoutTasksInputObjectZodSchema = makeSchema();
