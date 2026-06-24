import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema as EnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema } from './EnumTaskExecutionTargetTypeWithAggregatesFilter.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTaskExecutionActionTypeWithAggregatesFilterObjectSchema as EnumTaskExecutionActionTypeWithAggregatesFilterObjectSchema } from './EnumTaskExecutionActionTypeWithAggregatesFilter.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskexecutionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskExecutionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskExecutionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskExecutionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema), TaskExecutionTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  actionType: z.union([z.lazy(() => EnumTaskExecutionActionTypeWithAggregatesFilterObjectSchema), TaskExecutionActionTypeSchema]).optional(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  taskItemId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const TaskExecutionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskExecutionScalarWhereWithAggregatesInput> = taskexecutionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskExecutionScalarWhereWithAggregatesInput>;
export const TaskExecutionScalarWhereWithAggregatesInputObjectZodSchema = taskexecutionscalarwherewithaggregatesinputSchema;
