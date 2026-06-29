import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectSchema as WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  actorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workflowEvents: z.lazy(() => WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectSchema).optional()
}).strict();
export const BusinessEventLogUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUncheckedUpdateInput>;
export const BusinessEventLogUncheckedUpdateInputObjectZodSchema = makeSchema();
