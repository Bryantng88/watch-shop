import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  eventLogId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateWithoutExecutionInput>;
export const WorkflowExecutionEventCreateWithoutExecutionInputObjectZodSchema = makeSchema();
