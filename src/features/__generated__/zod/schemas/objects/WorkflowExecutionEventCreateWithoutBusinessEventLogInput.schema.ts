import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateNestedOneWithoutEventsInputObjectSchema as WorkflowExecutionCreateNestedOneWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateNestedOneWithoutEventsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.coerce.date().optional(),
  execution: z.lazy(() => WorkflowExecutionCreateNestedOneWithoutEventsInputObjectSchema)
}).strict();
export const WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
