import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.coerce.date().optional(),
  businessEventLogId: z.string().optional().nullable()
}).strict();
export const WorkflowExecutionEventUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUncheckedCreateInput>;
export const WorkflowExecutionEventUncheckedCreateInputObjectZodSchema = makeSchema();
