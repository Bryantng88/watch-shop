import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  executionId: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  businessEventLogId: z.literal(true).optional()
}).strict();
export const WorkflowExecutionEventMinAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventMinAggregateInputType>;
export const WorkflowExecutionEventMinAggregateInputObjectZodSchema = makeSchema();
