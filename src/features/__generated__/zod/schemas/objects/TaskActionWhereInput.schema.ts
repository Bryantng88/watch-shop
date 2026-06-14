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
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskTypeScalarRelationFilterObjectSchema as TaskTypeScalarRelationFilterObjectSchema } from './TaskTypeScalarRelationFilter.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema';
import { TaskListRelationFilterObjectSchema as TaskListRelationFilterObjectSchema } from './TaskListRelationFilter.schema';
import { ServiceCatalogNullableScalarRelationFilterObjectSchema as ServiceCatalogNullableScalarRelationFilterObjectSchema } from './ServiceCatalogNullableScalarRelationFilter.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { TechnicalDetailCatalogNullableScalarRelationFilterObjectSchema as TechnicalDetailCatalogNullableScalarRelationFilterObjectSchema } from './TechnicalDetailCatalogNullableScalarRelationFilter.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema';
import { SupplyCatalogNullableScalarRelationFilterObjectSchema as SupplyCatalogNullableScalarRelationFilterObjectSchema } from './SupplyCatalogNullableScalarRelationFilter.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema';
import { MechanicalPartCatalogNullableScalarRelationFilterObjectSchema as MechanicalPartCatalogNullableScalarRelationFilterObjectSchema } from './MechanicalPartCatalogNullableScalarRelationFilter.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema'

const taskactionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskActionWhereInputObjectSchema), z.lazy(() => TaskActionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskActionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskActionWhereInputObjectSchema), z.lazy(() => TaskActionWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  taskType: z.union([z.lazy(() => TaskTypeScalarRelationFilterObjectSchema), z.lazy(() => TaskTypeWhereInputObjectSchema)]).optional(),
  tasks: z.lazy(() => TaskListRelationFilterObjectSchema).optional(),
  serviceCatalog: z.union([z.lazy(() => ServiceCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  technicalDetailCatalog: z.union([z.lazy(() => TechnicalDetailCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema)]).optional(),
  supplyCatalog: z.union([z.lazy(() => SupplyCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => SupplyCatalogWhereInputObjectSchema)]).optional(),
  mechanicalPartCatalog: z.union([z.lazy(() => MechanicalPartCatalogNullableScalarRelationFilterObjectSchema), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema)]).optional()
}).strict();
export const TaskActionWhereInputObjectSchema: z.ZodType<Prisma.TaskActionWhereInput> = taskactionwhereinputSchema as unknown as z.ZodType<Prisma.TaskActionWhereInput>;
export const TaskActionWhereInputObjectZodSchema = taskactionwhereinputSchema;
