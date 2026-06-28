import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './WorkflowTemplateInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowTemplateSelectObjectSchema).optional(),
  include: z.lazy(() => WorkflowTemplateIncludeObjectSchema).optional()
}).strict();
export const WorkflowTemplateArgsObjectSchema = makeSchema();
export const WorkflowTemplateArgsObjectZodSchema = makeSchema();
