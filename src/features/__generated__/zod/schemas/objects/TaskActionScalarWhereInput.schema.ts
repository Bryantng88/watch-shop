import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTaskCompletionModeFilterObjectSchema as EnumTaskCompletionModeFilterObjectSchema } from './EnumTaskCompletionModeFilter.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { EnumTaskExecutionTargetTypeNullableFilterObjectSchema as EnumTaskExecutionTargetTypeNullableFilterObjectSchema } from './EnumTaskExecutionTargetTypeNullableFilter.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTechnicalActionModeNullableFilterObjectSchema as EnumTechnicalActionModeNullableFilterObjectSchema } from './EnumTechnicalActionModeNullableFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskactionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskActionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskTypeId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  completionMode: z.union([z.lazy(() => EnumTaskCompletionModeFilterObjectSchema), TaskCompletionModeSchema]).optional(),
  completionRuleKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  targetType: z.union([z.lazy(() => EnumTaskExecutionTargetTypeNullableFilterObjectSchema), TaskExecutionTargetTypeSchema]).optional().nullable(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalDetailCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  supplyCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mechanicalPartCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalActionMode: z.union([z.lazy(() => EnumTechnicalActionModeNullableFilterObjectSchema), TechnicalActionModeSchema]).optional().nullable(),
  defaultTitleTemplate: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  defaultDescriptionTemplate: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskActionScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskActionScalarWhereInput> = taskactionscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskActionScalarWhereInput>;
export const TaskActionScalarWhereInputObjectZodSchema = taskactionscalarwhereinputSchema;
