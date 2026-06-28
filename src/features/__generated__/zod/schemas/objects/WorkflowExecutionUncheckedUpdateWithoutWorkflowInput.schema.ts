import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { EnumWorkflowExecutionStatusFieldUpdateOperationsInputObjectSchema as EnumWorkflowExecutionStatusFieldUpdateOperationsInputObjectSchema } from './EnumWorkflowExecutionStatusFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInputObjectSchema as WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionTargetType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionTargetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([WorkflowExecutionStatusSchema, z.lazy(() => EnumWorkflowExecutionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  errorMessage: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  failedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  events: z.lazy(() => WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUncheckedUpdateWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUncheckedUpdateWithoutWorkflowInput>;
export const WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectZodSchema = makeSchema();
