import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { TaskUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema as TaskUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutTaskTypeInput.schema'

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
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema).optional()
}).strict();
export const TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskTypeUncheckedCreateWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUncheckedCreateWithoutTaskActionInput>;
export const TaskTypeUncheckedCreateWithoutTaskActionInputObjectZodSchema = makeSchema();
