import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateArgsObjectSchema as WorkflowTemplateArgsObjectSchema } from './WorkflowTemplateArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  workflowId: z.boolean().optional(),
  actionType: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  configJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  workflow: z.union([z.boolean(), z.lazy(() => WorkflowTemplateArgsObjectSchema)]).optional()
}).strict();
export const WorkflowActionSelectObjectSchema: z.ZodType<Prisma.WorkflowActionSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionSelect>;
export const WorkflowActionSelectObjectZodSchema = makeSchema();
