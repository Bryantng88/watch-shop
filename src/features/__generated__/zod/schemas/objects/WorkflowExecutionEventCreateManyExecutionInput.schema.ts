import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  createdAt: z.coerce.date().optional(),
  businessEventLogId: z.string().optional().nullable()
}).strict();
export const WorkflowExecutionEventCreateManyExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyExecutionInput>;
export const WorkflowExecutionEventCreateManyExecutionInputObjectZodSchema = makeSchema();
