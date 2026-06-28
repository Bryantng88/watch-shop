import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './WorkflowEventLogSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WorkflowEventLogSelectObjectSchema).optional()
}).strict();
export const WorkflowEventLogArgsObjectSchema = makeSchema();
export const WorkflowEventLogArgsObjectZodSchema = makeSchema();
