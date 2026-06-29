import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInputObjectSchema as BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInputObjectSchema } from './BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  eventKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  businessEventLog: z.lazy(() => BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateWithoutExecutionInput>;
export const WorkflowExecutionEventUpdateWithoutExecutionInputObjectZodSchema = makeSchema();
