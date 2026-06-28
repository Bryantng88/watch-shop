import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './WorkflowConditionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowConditionSelectObjectSchema).optional(),
  include: z.lazy(() => WorkflowConditionIncludeObjectSchema).optional()
}).strict();
export const WorkflowConditionArgsObjectSchema = makeSchema();
export const WorkflowConditionArgsObjectZodSchema = makeSchema();
