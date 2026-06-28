import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema as WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema } from './WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventLogId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  execution: z.lazy(() => WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventUpdateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateInput>;
export const WorkflowExecutionEventUpdateInputObjectZodSchema = makeSchema();
