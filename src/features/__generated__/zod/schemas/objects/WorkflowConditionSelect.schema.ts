import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateArgsObjectSchema as WorkflowTemplateArgsObjectSchema } from './WorkflowTemplateArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  workflowId: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  configJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workflow: z.union([z.boolean(), z.lazy(() => WorkflowTemplateArgsObjectSchema)]).optional()
}).strict();
export const WorkflowConditionSelectObjectSchema: z.ZodType<Prisma.WorkflowConditionSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionSelect>;
export const WorkflowConditionSelectObjectZodSchema = makeSchema();
