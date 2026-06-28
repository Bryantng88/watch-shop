import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateArgsObjectSchema as WorkflowTemplateArgsObjectSchema } from './WorkflowTemplateArgs.schema';
import { WorkflowExecutionEventFindManySchema as WorkflowExecutionEventFindManySchema } from '../findManyWorkflowExecutionEvent.schema';
import { WorkflowExecutionCountOutputTypeArgsObjectSchema as WorkflowExecutionCountOutputTypeArgsObjectSchema } from './WorkflowExecutionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  workflow: z.union([z.boolean(), z.lazy(() => WorkflowTemplateArgsObjectSchema)]).optional(),
  events: z.union([z.boolean(), z.lazy(() => WorkflowExecutionEventFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkflowExecutionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionIncludeObjectSchema: z.ZodType<Prisma.WorkflowExecutionInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionInclude>;
export const WorkflowExecutionIncludeObjectZodSchema = makeSchema();
