import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  workflowId: z.literal(true).optional(),
  actionTargetType: z.literal(true).optional(),
  actionTargetId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  errorMessage: z.literal(true).optional(),
  startedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional(),
  failedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WorkflowExecutionMaxAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionMaxAggregateInputType>;
export const WorkflowExecutionMaxAggregateInputObjectZodSchema = makeSchema();
