import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTaskSourceFilterObjectSchema as EnumTaskSourceFilterObjectSchema } from './EnumTaskSourceFilter.schema';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { EnumTaskDomainFilterObjectSchema as EnumTaskDomainFilterObjectSchema } from './EnumTaskDomainFilter.schema';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { EnumTaskModeFilterObjectSchema as EnumTaskModeFilterObjectSchema } from './EnumTaskModeFilter.schema';
import { TaskModeSchema } from '../enums/TaskMode.schema';
import { EnumTaskStatusFilterObjectSchema as EnumTaskStatusFilterObjectSchema } from './EnumTaskStatusFilter.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => EnumTaskSourceFilterObjectSchema), TaskSourceSchema]).optional(),
  domain: z.union([z.lazy(() => EnumTaskDomainFilterObjectSchema), TaskDomainSchema]).optional(),
  taskTypeId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mode: z.union([z.lazy(() => EnumTaskModeFilterObjectSchema), TaskModeSchema]).optional(),
  status: z.union([z.lazy(() => EnumTaskStatusFilterObjectSchema), TaskStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  dueAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  completedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  cancelledByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  watchId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  paymentId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workCaseId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  taskActionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const TaskScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskScalarWhereInput> = taskscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskScalarWhereInput>;
export const TaskScalarWhereInputObjectZodSchema = taskscalarwhereinputSchema;
