import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumTaskExecutionTargetTypeFilterObjectSchema as EnumTaskExecutionTargetTypeFilterObjectSchema } from './EnumTaskExecutionTargetTypeFilter.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTaskExecutionActionTypeFilterObjectSchema as EnumTaskExecutionActionTypeFilterObjectSchema } from './EnumTaskExecutionActionTypeFilter.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskScalarRelationFilterObjectSchema as TaskScalarRelationFilterObjectSchema } from './TaskScalarRelationFilter.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaskChecklistItemNullableScalarRelationFilterObjectSchema as TaskChecklistItemNullableScalarRelationFilterObjectSchema } from './TaskChecklistItemNullableScalarRelationFilter.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema'

const taskexecutionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskExecutionWhereInputObjectSchema), z.lazy(() => TaskExecutionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskExecutionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskExecutionWhereInputObjectSchema), z.lazy(() => TaskExecutionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumTaskExecutionTargetTypeFilterObjectSchema), TaskExecutionTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actionType: z.union([z.lazy(() => EnumTaskExecutionActionTypeFilterObjectSchema), TaskExecutionActionTypeSchema]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  checklistItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  task: z.union([z.lazy(() => TaskScalarRelationFilterObjectSchema), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  createdByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  checklistItem: z.union([z.lazy(() => TaskChecklistItemNullableScalarRelationFilterObjectSchema), z.lazy(() => TaskChecklistItemWhereInputObjectSchema)]).optional()
}).strict();
export const TaskExecutionWhereInputObjectSchema: z.ZodType<Prisma.TaskExecutionWhereInput> = taskexecutionwhereinputSchema as unknown as z.ZodType<Prisma.TaskExecutionWhereInput>;
export const TaskExecutionWhereInputObjectZodSchema = taskexecutionwhereinputSchema;
