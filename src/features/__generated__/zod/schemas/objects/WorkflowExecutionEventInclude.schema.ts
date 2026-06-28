import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionArgsObjectSchema as WorkflowExecutionArgsObjectSchema } from './WorkflowExecutionArgs.schema'

const makeSchema = () => z.object({
  execution: z.union([z.boolean(), z.lazy(() => WorkflowExecutionArgsObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionEventIncludeObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventInclude>;
export const WorkflowExecutionEventIncludeObjectZodSchema = makeSchema();
