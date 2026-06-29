import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCreateNestedOneWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateNestedOneWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateNestedOneWithoutWorkflowEventsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.coerce.date().optional(),
  businessEventLog: z.lazy(() => BusinessEventLogCreateNestedOneWithoutWorkflowEventsInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutExecutionInput>;
export const WorkflowExecutionEventCreateWithoutExecutionInputObjectZodSchema = makeSchema();
