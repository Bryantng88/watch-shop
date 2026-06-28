import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCountOutputTypeSelectObjectSchema as WorkflowExecutionCountOutputTypeSelectObjectSchema } from './WorkflowExecutionCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowExecutionCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WorkflowExecutionCountOutputTypeArgsObjectSchema = makeSchema();
export const WorkflowExecutionCountOutputTypeArgsObjectZodSchema = makeSchema();
