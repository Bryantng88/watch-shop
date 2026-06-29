import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventFindManySchema as WorkflowExecutionEventFindManySchema } from '../findManyWorkflowExecutionEvent.schema';
import { BusinessEventLogCountOutputTypeArgsObjectSchema as BusinessEventLogCountOutputTypeArgsObjectSchema } from './BusinessEventLogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  workflowEvents: z.union([z.boolean(), z.lazy(() => WorkflowExecutionEventFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BusinessEventLogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BusinessEventLogIncludeObjectSchema: z.ZodType<Prisma.BusinessEventLogInclude> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogInclude>;
export const BusinessEventLogIncludeObjectZodSchema = makeSchema();
