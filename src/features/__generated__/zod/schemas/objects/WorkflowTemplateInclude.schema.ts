import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionFindManySchema as WorkflowConditionFindManySchema } from '../findManyWorkflowCondition.schema';
import { WorkflowActionFindManySchema as WorkflowActionFindManySchema } from '../findManyWorkflowAction.schema';
import { WorkflowExecutionFindManySchema as WorkflowExecutionFindManySchema } from '../findManyWorkflowExecution.schema';
import { AppTagFindManySchema as AppTagFindManySchema } from '../findManyAppTag.schema';
import { WorkflowTemplateCountOutputTypeArgsObjectSchema as WorkflowTemplateCountOutputTypeArgsObjectSchema } from './WorkflowTemplateCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  conditions: z.union([z.boolean(), z.lazy(() => WorkflowConditionFindManySchema)]).optional(),
  actions: z.union([z.boolean(), z.lazy(() => WorkflowActionFindManySchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => WorkflowExecutionFindManySchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => AppTagFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkflowTemplateCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateIncludeObjectSchema: z.ZodType<Prisma.WorkflowTemplateInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateInclude>;
export const WorkflowTemplateIncludeObjectZodSchema = makeSchema();
