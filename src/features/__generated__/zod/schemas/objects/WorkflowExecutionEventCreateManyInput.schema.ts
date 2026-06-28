import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  eventLogId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkflowExecutionEventCreateManyInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyInput>;
export const WorkflowExecutionEventCreateManyInputObjectZodSchema = makeSchema();
