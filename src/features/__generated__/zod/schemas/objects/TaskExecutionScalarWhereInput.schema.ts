import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumTaskExecutionTargetTypeFilterObjectSchema as EnumTaskExecutionTargetTypeFilterObjectSchema } from './EnumTaskExecutionTargetTypeFilter.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTaskExecutionActionTypeFilterObjectSchema as EnumTaskExecutionActionTypeFilterObjectSchema } from './EnumTaskExecutionActionTypeFilter.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskexecutionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumTaskExecutionTargetTypeFilterObjectSchema), TaskExecutionTargetTypeSchema]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actionType: z.union([z.lazy(() => EnumTaskExecutionActionTypeFilterObjectSchema), TaskExecutionActionTypeSchema]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskExecutionScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskExecutionScalarWhereInput> = taskexecutionscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskExecutionScalarWhereInput>;
export const TaskExecutionScalarWhereInputObjectZodSchema = taskexecutionscalarwhereinputSchema;
