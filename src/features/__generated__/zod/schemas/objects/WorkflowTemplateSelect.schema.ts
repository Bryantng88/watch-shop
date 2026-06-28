import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionFindManySchema as WorkflowConditionFindManySchema } from '../findManyWorkflowCondition.schema';
import { WorkflowActionFindManySchema as WorkflowActionFindManySchema } from '../findManyWorkflowAction.schema';
import { WorkflowExecutionFindManySchema as WorkflowExecutionFindManySchema } from '../findManyWorkflowExecution.schema';
import { AppTagFindManySchema as AppTagFindManySchema } from '../findManyAppTag.schema';
import { WorkflowTemplateCountOutputTypeArgsObjectSchema as WorkflowTemplateCountOutputTypeArgsObjectSchema } from './WorkflowTemplateCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  status: z.boolean().optional(),
  strategy: z.boolean().optional(),
  ownerType: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  isSystem: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  conditions: z.union([z.boolean(), z.lazy(() => WorkflowConditionFindManySchema)]).optional(),
  actions: z.union([z.boolean(), z.lazy(() => WorkflowActionFindManySchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => WorkflowExecutionFindManySchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => AppTagFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkflowTemplateCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateSelectObjectSchema: z.ZodType<Prisma.WorkflowTemplateSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateSelect>;
export const WorkflowTemplateSelectObjectZodSchema = makeSchema();
