import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema as WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema } from './WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  execution: z.lazy(() => WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
