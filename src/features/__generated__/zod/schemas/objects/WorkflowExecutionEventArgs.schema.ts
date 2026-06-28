import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './WorkflowExecutionEventInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowExecutionEventSelectObjectSchema).optional(),
  include: z.lazy(() => WorkflowExecutionEventIncludeObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventArgsObjectSchema = makeSchema();
export const WorkflowExecutionEventArgsObjectZodSchema = makeSchema();
