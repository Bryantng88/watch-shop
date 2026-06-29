import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionArgsObjectSchema as WorkflowExecutionArgsObjectSchema } from './WorkflowExecutionArgs.schema';
import { BusinessEventLogArgsObjectSchema as BusinessEventLogArgsObjectSchema } from './BusinessEventLogArgs.schema'

const makeSchema = () => z.object({
  execution: z.union([z.boolean(), z.lazy(() => WorkflowExecutionArgsObjectSchema)]).optional(),
  businessEventLog: z.union([z.boolean(), z.lazy(() => BusinessEventLogArgsObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionEventIncludeObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventInclude>;
export const WorkflowExecutionEventIncludeObjectZodSchema = makeSchema();
