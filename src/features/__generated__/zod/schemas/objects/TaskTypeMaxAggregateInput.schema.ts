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
  updatedAt: z.literal(true).optional()
}).strict();
export const TaskTypeMaxAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeMaxAggregateInputType>;
export const TaskTypeMaxAggregateInputObjectZodSchema = makeSchema();
