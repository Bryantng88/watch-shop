import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTaskSourceWithAggregatesFilterObjectSchema as EnumTaskSourceWithAggregatesFilterObjectSchema } from './EnumTaskSourceWithAggregatesFilter.schema';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { EnumTaskKindWithAggregatesFilterObjectSchema as EnumTaskKindWithAggregatesFilterObjectSchema } from './EnumTaskKindWithAggregatesFilter.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskStatusWithAggregatesFilterObjectSchema as EnumTaskStatusWithAggregatesFilterObjectSchema } from './EnumTaskStatusWithAggregatesFilter.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskPriorityWithAggregatesFilterObjectSchema as EnumTaskPriorityWithAggregatesFilterObjectSchema } from './EnumTaskPriorityWithAggregatesFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { UuidNullableWithAggregatesFilterObjectSchema as UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => EnumTaskSourceWithAggregatesFilterObjectSchema), TaskSourceSchema]).optional(),
  kind: z.union([z.lazy(() => EnumTaskKindWithAggregatesFilterObjectSchema), TaskKindSchema]).optional(),
  status: z.union([z.lazy(() => EnumTaskStatusWithAggregatesFilterObjectSchema), TaskStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityWithAggregatesFilterObjectSchema), TaskPrioritySchema]).optional(),
  dueAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  completedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  cancelledByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  watchId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  shipmentId: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  paymentId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  taskTypeId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskScalarWhereWithAggregatesInput> = taskscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskScalarWhereWithAggregatesInput>;
export const TaskScalarWhereWithAggregatesInputObjectZodSchema = taskscalarwherewithaggregatesinputSchema;
