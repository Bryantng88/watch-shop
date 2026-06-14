import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTaskCompletionModeWithAggregatesFilterObjectSchema as EnumTaskCompletionModeWithAggregatesFilterObjectSchema } from './EnumTaskCompletionModeWithAggregatesFilter.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { EnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectSchema as EnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectSchema } from './EnumTaskExecutionTargetTypeNullableWithAggregatesFilter.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema as EnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema } from './EnumTechnicalActionModeNullableWithAggregatesFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskactionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskActionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskActionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskActionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskActionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskActionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  taskTypeId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  completionMode: z.union([z.lazy(() => EnumTaskCompletionModeWithAggregatesFilterObjectSchema), TaskCompletionModeSchema]).optional(),
  completionRuleKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  targetType: z.union([z.lazy(() => EnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectSchema), TaskExecutionTargetTypeSchema]).optional().nullable(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  technicalDetailCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  supplyCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  mechanicalPartCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  technicalActionMode: z.union([z.lazy(() => EnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema), TechnicalActionModeSchema]).optional().nullable(),
  defaultTitleTemplate: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  defaultDescriptionTemplate: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskActionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskActionScalarWhereWithAggregatesInput> = taskactionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskActionScalarWhereWithAggregatesInput>;
export const TaskActionScalarWhereWithAggregatesInputObjectZodSchema = taskactionscalarwherewithaggregatesinputSchema;
