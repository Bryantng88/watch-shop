import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WorkCaseActivityOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityOrderByRelationAggregateInput>;
export const WorkCaseActivityOrderByRelationAggregateInputObjectZodSchema = makeSchema();
