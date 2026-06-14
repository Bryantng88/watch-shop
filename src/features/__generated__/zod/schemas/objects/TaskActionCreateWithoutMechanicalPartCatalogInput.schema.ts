import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskTypeCreateNestedOneWithoutTaskActionInputObjectSchema as TaskTypeCreateNestedOneWithoutTaskActionInputObjectSchema } from './TaskTypeCreateNestedOneWithoutTaskActionInput.schema';
import { TaskCreateNestedManyWithoutTaskActionInputObjectSchema as TaskCreateNestedManyWithoutTaskActionInputObjectSchema } from './TaskCreateNestedManyWithoutTaskActionInput.schema';
import { ServiceCatalogCreateNestedOneWithoutTaskActionInputObjectSchema as ServiceCatalogCreateNestedOneWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInput.schema';
import { SupplyCatalogCreateNestedOneWithoutTaskActionInputObjectSchema as SupplyCatalogCreateNestedOneWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateNestedOneWithoutTaskActionInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  completionMode: TaskCompletionModeSchema.optional(),
  completionRuleKey: z.string().optional().nullable(),
  targetType: TaskExecutionTargetTypeSchema.optional().nullable(),
  technicalActionMode: TechnicalActionModeSchema.optional().nullable(),
  defaultTitleTemplate: z.string().optional().nullable(),
  defaultDescriptionTemplate: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskType: z.lazy(() => TaskTypeCreateNestedOneWithoutTaskActionInputObjectSchema),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutTaskActionInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutTaskActionInputObjectSchema).optional(),
  technicalDetailCatalog: z.lazy(() => TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInputObjectSchema).optional(),
  supplyCatalog: z.lazy(() => SupplyCatalogCreateNestedOneWithoutTaskActionInputObjectSchema).optional()
}).strict();
export const TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateWithoutMechanicalPartCatalogInput>;
export const TaskActionCreateWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
