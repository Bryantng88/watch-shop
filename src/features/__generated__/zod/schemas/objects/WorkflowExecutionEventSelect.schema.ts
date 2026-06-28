import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionArgsObjectSchema as WorkflowExecutionArgsObjectSchema } from './WorkflowExecutionArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  executionId: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  eventLogId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  execution: z.union([z.boolean(), z.lazy(() => WorkflowExecutionArgsObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionEventSelectObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventSelect>;
export const WorkflowExecutionEventSelectObjectZodSchema = makeSchema();
