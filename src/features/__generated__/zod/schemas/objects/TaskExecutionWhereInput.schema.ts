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
import { TaskItemNullableScalarRelationFilterObjectSchema as TaskItemNullableScalarRelationFilterObjectSchema } from './TaskItemNullableScalarRelationFilter.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { ServiceRequestNullableScalarRelationFilterObjectSchema as ServiceRequestNullableScalarRelationFilterObjectSchema } from './ServiceRequestNullableScalarRelationFilter.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { TechnicalIssueNullableScalarRelationFilterObjectSchema as TechnicalIssueNullableScalarRelationFilterObjectSchema } from './TechnicalIssueNullableScalarRelationFilter.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

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
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  taskItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  task: z.union([z.lazy(() => TaskScalarRelationFilterObjectSchema), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  createdByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  taskItem: z.union([z.lazy(() => TaskItemNullableScalarRelationFilterObjectSchema), z.lazy(() => TaskItemWhereInputObjectSchema)]).optional(),
  serviceRequest: z.union([z.lazy(() => ServiceRequestNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  technicalIssue: z.union([z.lazy(() => TechnicalIssueNullableScalarRelationFilterObjectSchema), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional()
}).strict();
export const TaskExecutionWhereInputObjectSchema: z.ZodType<Prisma.TaskExecutionWhereInput> = taskexecutionwhereinputSchema as unknown as z.ZodType<Prisma.TaskExecutionWhereInput>;
export const TaskExecutionWhereInputObjectZodSchema = taskexecutionwhereinputSchema;
