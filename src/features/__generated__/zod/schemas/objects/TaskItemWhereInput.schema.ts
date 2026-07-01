import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTaskStatusFilterObjectSchema as EnumTaskStatusFilterObjectSchema } from './EnumTaskStatusFilter.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskScalarRelationFilterObjectSchema as TaskScalarRelationFilterObjectSchema } from './TaskScalarRelationFilter.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaskExecutionListRelationFilterObjectSchema as TaskExecutionListRelationFilterObjectSchema } from './TaskExecutionListRelationFilter.schema';
import { TaskItemChecklistListRelationFilterObjectSchema as TaskItemChecklistListRelationFilterObjectSchema } from './TaskItemChecklistListRelationFilter.schema';
import { TaskItemActivityListRelationFilterObjectSchema as TaskItemActivityListRelationFilterObjectSchema } from './TaskItemActivityListRelationFilter.schema'

const taskitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemWhereInputObjectSchema), z.lazy(() => TaskItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemWhereInputObjectSchema), z.lazy(() => TaskItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumTaskStatusFilterObjectSchema), TaskStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  dueAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  task: z.union([z.lazy(() => TaskScalarRelationFilterObjectSchema), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  assignedToUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  executions: z.lazy(() => TaskExecutionListRelationFilterObjectSchema).optional(),
  checklists: z.lazy(() => TaskItemChecklistListRelationFilterObjectSchema).optional(),
  activities: z.lazy(() => TaskItemActivityListRelationFilterObjectSchema).optional(),
  User: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const TaskItemWhereInputObjectSchema: z.ZodType<Prisma.TaskItemWhereInput> = taskitemwhereinputSchema as unknown as z.ZodType<Prisma.TaskItemWhereInput>;
export const TaskItemWhereInputObjectZodSchema = taskitemwhereinputSchema;
