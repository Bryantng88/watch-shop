import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCountOutputTypeSelectObjectSchema as WorkflowTemplateCountOutputTypeSelectObjectSchema } from './WorkflowTemplateCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowTemplateCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WorkflowTemplateCountOutputTypeArgsObjectSchema = makeSchema();
export const WorkflowTemplateCountOutputTypeArgsObjectZodSchema = makeSchema();
