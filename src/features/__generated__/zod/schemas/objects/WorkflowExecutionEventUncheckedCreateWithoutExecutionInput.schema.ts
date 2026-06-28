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
export const WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUncheckedCreateWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUncheckedCreateWithoutExecutionInput>;
export const WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectZodSchema = makeSchema();
