import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateArgsObjectSchema as WorkflowTemplateArgsObjectSchema } from './WorkflowTemplateArgs.schema';
import { WorkflowExecutionEventFindManySchema as WorkflowExecutionEventFindManySchema } from '../findManyWorkflowExecutionEvent.schema';
import { WorkflowExecutionCountOutputTypeArgsObjectSchema as WorkflowExecutionCountOutputTypeArgsObjectSchema } from './WorkflowExecutionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  workflowId: z.boolean().optional(),
  actionTargetType: z.boolean().optional(),
  actionTargetId: z.boolean().optional(),
  status: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  failedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workflow: z.union([z.boolean(), z.lazy(() => WorkflowTemplateArgsObjectSchema)]).optional(),
  events: z.union([z.boolean(), z.lazy(() => WorkflowExecutionEventFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkflowExecutionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionSelectObjectSchema: z.ZodType<Prisma.WorkflowExecutionSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionSelect>;
export const WorkflowExecutionSelectObjectZodSchema = makeSchema();
