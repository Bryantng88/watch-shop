import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  scope: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WorkCaseCategoryMaxAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryMaxAggregateInputType>;
export const WorkCaseCategoryMaxAggregateInputObjectZodSchema = makeSchema();
