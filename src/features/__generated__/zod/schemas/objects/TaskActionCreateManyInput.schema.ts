import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskTypeId: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  completionMode: TaskCompletionModeSchema.optional(),
  completionRuleKey: z.string().optional().nullable(),
  targetType: TaskExecutionTargetTypeSchema.optional().nullable(),
  serviceCatalogId: z.string().optional().nullable(),
  technicalDetailCatalogId: z.string().optional().nullable(),
  supplyCatalogId: z.string().optional().nullable(),
  mechanicalPartCatalogId: z.string().optional().nullable(),
  technicalActionMode: TechnicalActionModeSchema.optional().nullable(),
  defaultTitleTemplate: z.string().optional().nullable(),
  defaultDescriptionTemplate: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskActionCreateManyInputObjectSchema: z.ZodType<Prisma.TaskActionCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManyInput>;
export const TaskActionCreateManyInputObjectZodSchema = makeSchema();
