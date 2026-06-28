import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  workflowId: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WorkflowConditionMinAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionMinAggregateInputType>;
export const WorkflowConditionMinAggregateInputObjectZodSchema = makeSchema();
