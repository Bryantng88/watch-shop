import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTaskDomainFilterObjectSchema as EnumTaskDomainFilterObjectSchema } from './EnumTaskDomainFilter.schema';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskCompletionModeFilterObjectSchema as EnumTaskCompletionModeFilterObjectSchema } from './EnumTaskCompletionModeFilter.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskListRelationFilterObjectSchema as TaskListRelationFilterObjectSchema } from './TaskListRelationFilter.schema'

const tasktypewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskTypeWhereInputObjectSchema), z.lazy(() => TaskTypeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskTypeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskTypeWhereInputObjectSchema), z.lazy(() => TaskTypeWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  domain: z.union([z.lazy(() => EnumTaskDomainFilterObjectSchema), TaskDomainSchema]).optional(),
  defaultPriority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  completionMode: z.union([z.lazy(() => EnumTaskCompletionModeFilterObjectSchema), TaskCompletionModeSchema]).optional(),
  completionRuleKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  tasks: z.lazy(() => TaskListRelationFilterObjectSchema).optional()
}).strict();
export const TaskTypeWhereInputObjectSchema: z.ZodType<Prisma.TaskTypeWhereInput> = tasktypewhereinputSchema as unknown as z.ZodType<Prisma.TaskTypeWhereInput>;
export const TaskTypeWhereInputObjectZodSchema = tasktypewhereinputSchema;
