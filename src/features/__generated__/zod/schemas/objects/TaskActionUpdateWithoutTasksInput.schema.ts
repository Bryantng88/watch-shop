import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema as EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema } from './EnumTaskCompletionModeFieldUpdateOperationsInput.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema as NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInput.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NullableEnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema as NullableEnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema } from './NullableEnumTechnicalActionModeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskTypeUpdateOneRequiredWithoutTaskActionNestedInputObjectSchema as TaskTypeUpdateOneRequiredWithoutTaskActionNestedInputObjectSchema } from './TaskTypeUpdateOneRequiredWithoutTaskActionNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutTaskActionNestedInput.schema';
import { TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema as TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema } from './TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInput.schema';
import { SupplyCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema as SupplyCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema } from './SupplyCatalogUpdateOneWithoutTaskActionNestedInput.schema';
import { MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema as MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema } from './MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completionMode: z.union([TaskCompletionModeSchema, z.lazy(() => EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  completionRuleKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  targetType: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  technicalActionMode: z.union([TechnicalActionModeSchema, z.lazy(() => NullableEnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultTitleTemplate: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultDescriptionTemplate: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  taskType: z.lazy(() => TaskTypeUpdateOneRequiredWithoutTaskActionNestedInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema).optional(),
  technicalDetailCatalog: z.lazy(() => TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema).optional(),
  supplyCatalog: z.lazy(() => SupplyCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema).optional(),
  mechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema).optional()
}).strict();
export const TaskActionUpdateWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithoutTasksInput>;
export const TaskActionUpdateWithoutTasksInputObjectZodSchema = makeSchema();
