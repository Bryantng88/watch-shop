import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema as EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema } from './EnumTaskExecutionTargetTypeFieldUpdateOperationsInput.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema as EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema } from './EnumTaskExecutionActionTypeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema as TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema } from './TaskUpdateOneRequiredWithoutExecutionsNestedInput.schema';
import { TaskItemUpdateOneWithoutExecutionsNestedInputObjectSchema as TaskItemUpdateOneWithoutExecutionsNestedInputObjectSchema } from './TaskItemUpdateOneWithoutExecutionsNestedInput.schema';
import { ServiceRequestUpdateOneWithoutTaskExecutionNestedInputObjectSchema as ServiceRequestUpdateOneWithoutTaskExecutionNestedInputObjectSchema } from './ServiceRequestUpdateOneWithoutTaskExecutionNestedInput.schema';
import { TechnicalIssueUpdateOneWithoutTaskExecutionNestedInputObjectSchema as TechnicalIssueUpdateOneWithoutTaskExecutionNestedInputObjectSchema } from './TechnicalIssueUpdateOneWithoutTaskExecutionNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionType: z.union([TaskExecutionActionTypeSchema, z.lazy(() => EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  checklistItemId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema).optional(),
  taskItem: z.lazy(() => TaskItemUpdateOneWithoutExecutionsNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateOneWithoutTaskExecutionNestedInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUpdateOneWithoutTaskExecutionNestedInputObjectSchema).optional()
}).strict();
export const TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithoutCreatedByUserInput>;
export const TaskExecutionUpdateWithoutCreatedByUserInputObjectZodSchema = makeSchema();
