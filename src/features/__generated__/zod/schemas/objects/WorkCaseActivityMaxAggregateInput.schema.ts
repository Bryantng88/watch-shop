import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  workCaseId: z.literal(true).optional(),
  actorId: z.literal(true).optional(),
  action: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const WorkCaseActivityMaxAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityMaxAggregateInputType>;
export const WorkCaseActivityMaxAggregateInputObjectZodSchema = makeSchema();
