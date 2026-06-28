import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './WorkflowActionSelect.schema';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './WorkflowActionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowActionSelectObjectSchema).optional(),
  include: z.lazy(() => WorkflowActionIncludeObjectSchema).optional()
}).strict();
export const WorkflowActionArgsObjectSchema = makeSchema();
export const WorkflowActionArgsObjectZodSchema = makeSchema();
