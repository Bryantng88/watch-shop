import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional()
}).strict();
export const WorkflowEventLogSelectObjectSchema: z.ZodType<Prisma.WorkflowEventLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogSelect>;
export const WorkflowEventLogSelectObjectZodSchema = makeSchema();
