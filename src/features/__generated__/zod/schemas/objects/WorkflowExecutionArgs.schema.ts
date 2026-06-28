import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionSelectObjectSchema as WorkflowExecutionSelectObjectSchema } from './WorkflowExecutionSelect.schema';
import { WorkflowExecutionIncludeObjectSchema as WorkflowExecutionIncludeObjectSchema } from './WorkflowExecutionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowExecutionSelectObjectSchema).optional(),
  include: z.lazy(() => WorkflowExecutionIncludeObjectSchema).optional()
}).strict();
export const WorkflowExecutionArgsObjectSchema = makeSchema();
export const WorkflowExecutionArgsObjectZodSchema = makeSchema();
