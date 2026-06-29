import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkflowExecutionEventCreateManyBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyBusinessEventLogInput>;
export const WorkflowExecutionEventCreateManyBusinessEventLogInputObjectZodSchema = makeSchema();
