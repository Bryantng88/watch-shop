import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventFindManySchema as WorkflowExecutionEventFindManySchema } from '../findManyWorkflowExecutionEvent.schema';
import { BusinessEventLogCountOutputTypeArgsObjectSchema as BusinessEventLogCountOutputTypeArgsObjectSchema } from './BusinessEventLogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  workflowEvents: z.union([z.boolean(), z.lazy(() => WorkflowExecutionEventFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BusinessEventLogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BusinessEventLogSelectObjectSchema: z.ZodType<Prisma.BusinessEventLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogSelect>;
export const BusinessEventLogSelectObjectZodSchema = makeSchema();
