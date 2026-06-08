import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  domain: z.literal(true).optional(),
  legacyKind: z.literal(true).optional(),
  defaultPriority: z.literal(true).optional(),
  completionMode: z.literal(true).optional(),
  completionRuleKey: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TaskTypeCountAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCountAggregateInputType>;
export const TaskTypeCountAggregateInputObjectZodSchema = makeSchema();
