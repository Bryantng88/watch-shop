import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  status: z.literal(true).optional(),
  strategy: z.literal(true).optional(),
  ownerType: z.literal(true).optional(),
  ownerId: z.literal(true).optional(),
  isSystem: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WorkflowTemplateMaxAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateMaxAggregateInputType>;
export const WorkflowTemplateMaxAggregateInputObjectZodSchema = makeSchema();
